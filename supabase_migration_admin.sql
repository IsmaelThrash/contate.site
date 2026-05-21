-- ============================================================
-- MIGRATION: Relação de Administrador e Painel Admin (opção 2)
-- Executar no Supabase SQL Editor
-- ============================================================

-- 1. Adicionar coluna is_admin na tabela public.usuarios (se não existir)
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Criar função de verificação de admin (evita recursão de RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql;

-- 3. Atualizar Políticas de Segurança (RLS) para conceder acesso total a Admins

-- UPDATE: próprio usuário OR admin
DROP POLICY IF EXISTS "usuarios_update_own" ON public.usuarios;
CREATE POLICY "usuarios_update_own" ON public.usuarios
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- DELETE: próprio usuário OR admin
DROP POLICY IF EXISTS "usuarios_delete_own" ON public.usuarios;
CREATE POLICY "usuarios_delete_own" ON public.usuarios
  FOR DELETE
  USING (auth.uid() = id OR public.is_admin());

-- 4. Definir o usuário administrador inicial pelo e-mail
-- Busca o ID de auth.users pelo e-mail e ativa is_admin na tabela public.usuarios
UPDATE public.usuarios
SET is_admin = true
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'ismaelthrash@gmail.com'
);
