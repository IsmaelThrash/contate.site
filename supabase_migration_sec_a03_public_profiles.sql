-- ============================================================
-- MIGRATION: SEC-A03 — View de Perfis Públicos + RLS Restritiva
-- Restringe exposição de dados da tabela usuarios para anônimos
-- Executar no Supabase SQL Editor
-- Data: 2026-08-26
-- ============================================================

-- 1. Criar view pública com SOMENTE colunas necessárias para a página /:slug
CREATE OR REPLACE VIEW public.perfis_publicos AS
SELECT
  id,
  slug,
  nome_exibicao,
  bio,
  cor_fundo,
  avatar,
  meta_titulo,
  meta_descricao
FROM public.usuarios
WHERE status = 1;  -- Só perfis ativos são visíveis publicamente

-- 2. Conceder acesso à view para anônimos e autenticados
GRANT SELECT ON public.perfis_publicos TO anon, authenticated;

-- 3. Restringir acesso direto à tabela usuarios
-- Anônimos veem apenas perfis ativos (sem colunas sensíveis via view acima)
-- Autenticados veem tudo (necessário para dashboard, admin, etc.)
DROP POLICY IF EXISTS "usuarios_select_public" ON usuarios;
CREATE POLICY "usuarios_select_public" ON usuarios
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL   -- Autenticados: acesso completo à tabela
    OR status = 1             -- Anônimos: apenas perfis ativos
  );
