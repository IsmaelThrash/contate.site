-- ============================================================
-- MIGRATION: SEC-A01 — Reescrita de claim_slug (IDOR fix)
-- Remove parâmetro p_user_id, usa auth.uid() diretamente
-- Executar no Supabase SQL Editor APÓS atualizar o front-end
-- Data: 2026-08-26
-- ============================================================

-- 1. Nova versão da função com assinatura (text) em vez de (uuid, text)
CREATE OR REPLACE FUNCTION public.claim_slug(p_slug text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- 2. Atualizar permissões para a nova assinatura
REVOKE ALL ON FUNCTION public.claim_slug(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_slug(text) TO authenticated;

-- 3. Remover a função antiga com assinatura (uuid, text)
-- Isso garante que ninguém pode chamar a versão vulnerável
DROP FUNCTION IF EXISTS public.claim_slug(uuid, text);
