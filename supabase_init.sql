-- Script de Inicialização Base do contate.site

CREATE TABLE public.usuarios (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    slug text UNIQUE,
    nome_exibicao text,
    bio text,
    cor_fundo text,
    status integer DEFAULT 1,
    is_admin boolean DEFAULT false,
    meta_titulo text,
    meta_descricao text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.slugs_reservados (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text NOT NULL,
    usuario_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    liberado_em timestamp with time zone NOT NULL
);

CREATE TABLE public.blocos_links (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    tipo text NOT NULL,
    titulo text,
    url text,
    ordem integer DEFAULT 0,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

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

-- Trigger para criar o perfil público automaticamente ao registrar um usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.usuarios (id, nome_exibicao)
  VALUES (new.id, split_part(new.email, '@', 1));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
