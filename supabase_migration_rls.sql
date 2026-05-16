-- ============================================================
-- MIGRATION: Segurança — RLS Policies (Parte 2.3)
-- Executar no Supabase SQL Editor
-- Data: 2026-05-16
-- ============================================================

-- 1. Habilitar RLS nas tabelas (se ainda não estiver ativo)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocos_links ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLÍTICAS PARA: usuarios
-- ============================================================

-- Leitura pública: qualquer pessoa pode ver perfis (para página /:slug)
DROP POLICY IF EXISTS "usuarios_select_public" ON usuarios;
CREATE POLICY "usuarios_select_public" ON usuarios
  FOR SELECT
  USING (true);

-- Inserção: apenas o próprio usuário pode criar seu registro
DROP POLICY IF EXISTS "usuarios_insert_own" ON usuarios;
CREATE POLICY "usuarios_insert_own" ON usuarios
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Atualização: apenas o próprio usuário pode atualizar seus dados
DROP POLICY IF EXISTS "usuarios_update_own" ON usuarios;
CREATE POLICY "usuarios_update_own" ON usuarios
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Deleção: apenas o próprio usuário pode excluir sua conta
DROP POLICY IF EXISTS "usuarios_delete_own" ON usuarios;
CREATE POLICY "usuarios_delete_own" ON usuarios
  FOR DELETE
  USING (auth.uid() = id);

-- ============================================================
-- POLÍTICAS PARA: blocos_links
-- ============================================================

-- Leitura pública: links visíveis para qualquer um (para a página pública)
DROP POLICY IF EXISTS "blocos_links_select_public" ON blocos_links;
CREATE POLICY "blocos_links_select_public" ON blocos_links
  FOR SELECT
  USING (true);

-- Inserção: apenas o dono pode adicionar links
DROP POLICY IF EXISTS "blocos_links_insert_own" ON blocos_links;
CREATE POLICY "blocos_links_insert_own" ON blocos_links
  FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- Atualização: apenas o dono pode modificar seus links (inclui reordenação)
DROP POLICY IF EXISTS "blocos_links_update_own" ON blocos_links;
CREATE POLICY "blocos_links_update_own" ON blocos_links
  FOR UPDATE
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- Deleção: apenas o dono pode remover seus links
DROP POLICY IF EXISTS "blocos_links_delete_own" ON blocos_links;
CREATE POLICY "blocos_links_delete_own" ON blocos_links
  FOR DELETE
  USING (auth.uid() = usuario_id);
