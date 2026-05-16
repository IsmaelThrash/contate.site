-- ============================================================
-- MIGRATION: Segurança — Validação de Slug no Backend (Parte 3.3)
-- Executar no Supabase SQL Editor
-- Data: 2026-05-16
-- ============================================================

-- Check constraint: garante formato e blocklist de slugs reservados
-- Mesmo que alguém faça request direto à API, o banco rejeita slugs inválidos

ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS slug_format_check;

ALTER TABLE usuarios ADD CONSTRAINT slug_format_check
  CHECK (
    slug IS NULL OR (
      slug ~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$'
      AND length(slug) >= 3
      AND length(slug) <= 30
      AND slug NOT IN (
        'admin', 'api', 'app', 'auth', 'blog', 'cadastro',
        'contato', 'dashboard', 'entrar', 'home', 'login',
        'logout', 'onboarding', 'perfil', 'planos', 'pricing',
        'profile', 'settings', 'signup', 'suporte', 'www',
        'help', 'about', 'terms', 'privacy', 'legal',
        'static', 'assets', 'public', 'images', 'css', 'js',
        'null', 'undefined', 'root', 'system', 'support'
      )
    )
  );

-- Verificar se a constraint foi criada corretamente (compatível com PostgreSQL 15+)
SELECT conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conname = 'slug_format_check';
