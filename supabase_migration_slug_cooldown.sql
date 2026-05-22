-- ============================================================
-- MIGRATION: Segurança — Cooldown de Slugs 
-- Executar no Supabase SQL Editor
-- ============================================================

-- 1. Criar a tabela de slugs reservados (Grace Period)
CREATE TABLE IF NOT EXISTS slugs_reservados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  usuario_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  liberado_em timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS para negar acesso direto via API (apenas interno)
ALTER TABLE slugs_reservados ENABLE ROW LEVEL SECURITY;

-- 2. Reescrever a função claim_slug com a lógica atômica de Cooldown
CREATE OR REPLACE FUNCTION claim_slug(p_user_id uuid, p_slug text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_slug_atual text;
  v_reserva_usuario_id uuid;
BEGIN
  -- Passo A: Verificar se o novo slug desejado está travado no cooldown por OUTRO usuário
  SELECT usuario_id INTO v_reserva_usuario_id
  FROM slugs_reservados
  WHERE slug = p_slug AND liberado_em > now()
  ORDER BY liberado_em DESC
  LIMIT 1;

  IF FOUND AND v_reserva_usuario_id != p_user_id THEN
    -- Slug reservado por outra pessoa e ainda dentro dos 30 dias
    RETURN false;
  END IF;

  -- Passo B: Descobrir o slug atual do usuário (se ele já tiver um)
  SELECT slug INTO v_slug_atual FROM usuarios WHERE id = p_user_id;

  -- Se o usuário já tiver um slug e ele for diferente do novo
  IF v_slug_atual IS NOT NULL AND v_slug_atual != p_slug THEN
    -- Guarda o antigo no cofre com proteção de 30 dias
    INSERT INTO slugs_reservados (slug, usuario_id, liberado_em)
    VALUES (v_slug_atual, p_user_id, now() + interval '30 days');
  END IF;

  -- Passo C: Atualiza o perfil principal. Se já existir, a UNIQUE constraint vai disparar a exceção
  UPDATE usuarios
    SET slug = p_slug,
        status = 1
  WHERE id = p_user_id;

  -- Passo D: Remover a reserva do slug atual (se o usuário estiver "recuperando" um slug dele)
  -- Para manter a tabela limpa
  DELETE FROM slugs_reservados WHERE slug = p_slug AND usuario_id = p_user_id;

  RETURN FOUND;
EXCEPTION
  WHEN unique_violation THEN
    -- O slug já pertence ativamente a alguém na tabela usuarios
    RETURN false;
END;
$$;

-- 3. Garantir permissões corretas
REVOKE ALL ON FUNCTION claim_slug(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION claim_slug(uuid, text) TO authenticated;
