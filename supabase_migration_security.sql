-- ============================================================
-- MIGRATION: Segurança — Race Condition de Slug (Parte 1.4)
-- Executar no Supabase SQL Editor
-- Data: 2026-05-16
-- ============================================================

-- 1. Garantir UNIQUE constraint na coluna slug da tabela usuarios
--    (Se já existir, o IF NOT EXISTS previne erro)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'usuarios_slug_unique'
      AND table_name = 'usuarios'
  ) THEN
    ALTER TABLE usuarios ADD CONSTRAINT usuarios_slug_unique UNIQUE (slug);
  END IF;
END $$;

-- 2. Função atômica para reivindicar slug
--    Retorna TRUE se conseguiu, FALSE se slug já estava em uso (unique_violation)
CREATE OR REPLACE FUNCTION claim_slug(p_user_id uuid, p_slug text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE usuarios
    SET slug = p_slug,
        status = 1
  WHERE id = p_user_id;

  RETURN FOUND;
EXCEPTION
  WHEN unique_violation THEN
    RETURN false;
END;
$$;

-- 3. Garantir que apenas o próprio usuário pode chamar a função
REVOKE ALL ON FUNCTION claim_slug(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION claim_slug(uuid, text) TO authenticated;
