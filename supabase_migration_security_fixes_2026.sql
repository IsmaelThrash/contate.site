-- ============================================================
-- MIGRATION: Remediação de Segurança 2026 (contate.site)
-- Executar no Supabase SQL Editor
-- ============================================================

-- 1. Normalização de dados legados e Constraint de cor_fundo (VULN-01 & VULN-03)
-- Limpa e sanitiza valores antigos incompatíveis existentes no banco antes de aplicar a trava
UPDATE usuarios 
SET cor_fundo = NULL 
WHERE cor_fundo IS NOT NULL 
  AND (
    cor_fundo ~ '[;{}<>'']'
    OR cor_fundo !~* '^(|#[0-9a-fA-F]{3,8}|(hsla?|rgba?)\([^)]*\)|hsl\(var\(--[a-zA-Z0-9-]+\)\)|[0-9\s%.,-]+|[a-zA-Z0-9_-]+)$'
  );

ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS cor_fundo_check;
ALTER TABLE usuarios ADD CONSTRAINT cor_fundo_check
  CHECK (
    cor_fundo IS NULL 
    OR cor_fundo = '' 
    OR (
      cor_fundo !~ '[;{}<>'']' 
      AND cor_fundo ~* '^(#[0-9a-fA-F]{3,8}|(hsla?|rgba?)\([^)]*\)|hsl\(var\(--[a-zA-Z0-9-]+\)\)|[0-9\s%.,-]+|[a-zA-Z0-9_-]+)$'
    )
  );

-- 2. Constraint de Validação para status de usuário (VULN-04)
-- 0 = Aguardando Ativação, 1 = Ativo, 2 = Suspenso/Inativo
UPDATE usuarios SET status = 1 WHERE status IS NULL;

ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS status_check;
ALTER TABLE usuarios ADD CONSTRAINT status_check
  CHECK (status IN (0, 1, 2));

-- 3. Políticas RLS Explícitas de INSERT e DELETE para a Tabela slugs_reservados (VULN-02)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'slugs_reservados' AND policyname = 'slugs_reservados_insert_own'
  ) THEN
    CREATE POLICY "slugs_reservados_insert_own" ON slugs_reservados
      FOR INSERT WITH CHECK (auth.uid() = usuario_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'slugs_reservados' AND policyname = 'slugs_reservados_delete_own'
  ) THEN
    CREATE POLICY "slugs_reservados_delete_own" ON slugs_reservados
      FOR DELETE USING (auth.uid() = usuario_id);
  END IF;
END $$;

-- 4. Função RPC is_admin() para validação no backend (VULN-05)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid() AND is_admin = true
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
