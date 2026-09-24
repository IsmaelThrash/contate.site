-- ============================================================
-- MIGRATION: SEC-360 — Auditoria e Blindagem Full-Stack 360º
-- contate.site — Row Level Security, RPC Hardening, Views e Permissões
-- Executado no Supabase / PostgreSQL
-- Data: 2026-09-24
-- ============================================================

-- 1. HARDENING DE FUNÇÕES SECURITY DEFINER (Prevenção de Search Path Hijacking / CWE-426)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
STABLE
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  SELECT u.is_admin INTO v_is_admin
  FROM public.usuarios u
  WHERE u.id = auth.uid();

  RETURN COALESCE(v_is_admin, false);
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  INSERT INTO public.usuarios (id, nome_exibicao)
  VALUES (new.id, split_part(new.email, '@', 1));
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_slug(p_slug text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_caller_id uuid := auth.uid();
  v_slug_atual text;
  v_reserva_usuario_id uuid;
BEGIN
  -- Verificação de autenticação
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Usuario nao autenticado';
  END IF;

  -- Passo A: Verificar se o novo slug desejado está travado no cooldown por OUTRO usuário
  SELECT usuario_id INTO v_reserva_usuario_id
  FROM slugs_reservados
  WHERE slug = p_slug AND liberado_em > now()
  ORDER BY liberado_em DESC
  LIMIT 1;

  IF FOUND AND v_reserva_usuario_id != v_caller_id THEN
    -- Slug reservado por outra pessoa e ainda dentro dos 30 dias
    RETURN false;
  END IF;

  -- Passo B: Descobrir o slug atual do chamador (se já tiver um)
  SELECT slug INTO v_slug_atual FROM usuarios WHERE id = v_caller_id;

  -- Passo C: Regra Anti-Acumulador
  IF v_slug_atual IS NOT NULL AND v_slug_atual != p_slug THEN
    -- Apaga qualquer reserva anterior (garante máximo 1 reserva)
    DELETE FROM slugs_reservados WHERE usuario_id = v_caller_id;

    -- Guarda APENAS o slug antigo mais recente no cofre
    INSERT INTO slugs_reservados (slug, usuario_id, liberado_em)
    VALUES (v_slug_atual, v_caller_id, now() + interval '30 days');
  END IF;

  -- Passo D: Seta bypass do guard de slug (SEC-C01) antes do UPDATE
  PERFORM set_config('app.bypass_slug_guard', 'true', true);

  -- Executa o UPDATE do novo slug
  UPDATE usuarios
    SET slug = p_slug,
        status = 1
  WHERE id = v_caller_id;

  -- Passo E: Remover a reserva caso esteja "recuperando" um slug próprio do cofre
  DELETE FROM slugs_reservados WHERE slug = p_slug AND usuario_id = v_caller_id;

  RETURN FOUND;
EXCEPTION
  WHEN unique_violation THEN
    -- O slug já pertence ativamente a alguém na tabela usuarios
    RETURN false;
END;
$$;


-- 2. CRIAÇÃO DA VIEW PÚBLICA SEGURA (perfis_publicos) COM SECURITY BARRIER
-- Oculta colunas administrativas como is_admin e protege contas suspensas (status = 2)
DROP VIEW IF EXISTS public.perfis_publicos CASCADE;

CREATE VIEW public.perfis_publicos
WITH (security_barrier = true)
AS
SELECT 
  id,
  slug,
  nome_exibicao,
  avatar,
  bio,
  cor_fundo,
  status,
  meta_titulo,
  meta_descricao,
  created_at
FROM public.usuarios
WHERE status IN (0, 1) AND slug IS NOT NULL;


-- 3. ATIVAÇÃO DE ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS PÚBLICAS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocos_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slugs_reservados ENABLE ROW LEVEL SECURITY;


-- 4. POLÍTICAS RLS PARA A TABELA usuarios
DROP POLICY IF EXISTS "usuarios_select_own" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_select_admin" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_update_own" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_update_admin" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_insert_own" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_delete_admin" ON public.usuarios;

-- Usuário autenticado pode ler seus próprios dados
CREATE POLICY "usuarios_select_own" ON public.usuarios
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Administradores podem ler todos os perfis
CREATE POLICY "usuarios_select_admin" ON public.usuarios
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- Usuário autenticado pode atualizar seus próprios dados (controlado por trigger guard_usuario_columns)
CREATE POLICY "usuarios_update_own" ON public.usuarios
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Administradores podem atualizar qualquer perfil
CREATE POLICY "usuarios_update_admin" ON public.usuarios
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Usuário pode inserir seu próprio registro inicial
CREATE POLICY "usuarios_insert_own" ON public.usuarios
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Exclusão de perfil: apenas o dono ou admin
CREATE POLICY "usuarios_delete_admin" ON public.usuarios
  FOR DELETE TO authenticated
  USING (auth.uid() = id OR public.is_admin());


-- 5. POLÍTICAS RLS PARA A TABELA blocos_links
DROP POLICY IF EXISTS "blocos_links_select_public" ON public.blocos_links;
DROP POLICY IF EXISTS "blocos_links_update_own" ON public.blocos_links;
DROP POLICY IF EXISTS "blocos_links_delete_own" ON public.blocos_links;
DROP POLICY IF EXISTS "blocos_links_insert_own" ON public.blocos_links;

-- Links ativos são públicos para qualquer visitante; inativos são visíveis apenas pelo dono ou admin
CREATE POLICY "blocos_links_select_public" ON public.blocos_links
  FOR SELECT TO public
  USING (ativo = true OR auth.uid() = usuario_id OR public.is_admin());

-- Apenas o dono pode criar links para seu perfil
CREATE POLICY "blocos_links_insert_own" ON public.blocos_links
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

-- O dono ou um administrador pode editar links
CREATE POLICY "blocos_links_update_own" ON public.blocos_links
  FOR UPDATE TO authenticated
  USING (auth.uid() = usuario_id OR public.is_admin())
  WITH CHECK (auth.uid() = usuario_id OR public.is_admin());

-- O dono ou um administrador pode remover links
CREATE POLICY "blocos_links_delete_own" ON public.blocos_links
  FOR DELETE TO authenticated
  USING (auth.uid() = usuario_id OR public.is_admin());


-- 6. POLÍTICAS RLS PARA A TABELA slugs_reservados
DROP POLICY IF EXISTS "slugs_reservados_select" ON public.slugs_reservados;
DROP POLICY IF EXISTS "slugs_reservados_insert" ON public.slugs_reservados;
DROP POLICY IF EXISTS "slugs_reservados_delete" ON public.slugs_reservados;

CREATE POLICY "slugs_reservados_select" ON public.slugs_reservados
  FOR SELECT TO authenticated
  USING (usuario_id = auth.uid() OR public.is_admin());

CREATE POLICY "slugs_reservados_insert" ON public.slugs_reservados
  FOR INSERT TO authenticated
  WITH CHECK (usuario_id = auth.uid() OR public.is_admin());

CREATE POLICY "slugs_reservados_delete" ON public.slugs_reservados
  FOR DELETE TO authenticated
  USING (usuario_id = auth.uid() OR public.is_admin());


-- 7. REGRAS DE PRIVILÉGIOS (LEAST PRIVILEGE)
-- Revoga acesso anônimo direto a tabelas sensíveis
REVOKE ALL ON public.usuarios FROM anon;
REVOKE ALL ON public.slugs_reservados FROM anon;

-- Permissões na view pública
GRANT SELECT ON public.perfis_publicos TO anon, authenticated;

-- Permissões em blocos_links
GRANT SELECT ON public.blocos_links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blocos_links TO authenticated;

-- Permissões em usuarios para usuários autenticados
GRANT SELECT, INSERT, UPDATE, DELETE ON public.usuarios TO authenticated;

-- Permissões em slugs_reservados para autenticados
GRANT SELECT, INSERT, DELETE ON public.slugs_reservados TO authenticated;

-- Permissões de execução de RPCs
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_slug(text) TO authenticated;
