-- ============================================================
-- MIGRATION: PERF-01 — Índices de Performance
-- Adiciona índices parciais e em chaves estrangeiras para otimização extrema
-- Executar no Supabase SQL Editor
-- Data: 2026-09-24
-- ============================================================

-- 1. Índice Parcial para blocos_links
-- Por que? A query na página de perfil SEMPRE filtra por "ativo = true".
-- Criando um índice parcial, o Postgres só indexa os links ativos (economiza espaço e CPU).
CREATE INDEX IF NOT EXISTS idx_blocos_ativos 
ON public.blocos_links(usuario_id) 
WHERE ativo = true;

-- 2. Índice para slugs_reservados
-- Chaves estrangeiras não são indexadas automaticamente pelo Postgres.
CREATE INDEX IF NOT EXISTS idx_slugs_reservados_usuario_id 
ON public.slugs_reservados(usuario_id);

-- NOTA: O slug na tabela usuarios já é UNIQUE, portanto já possui índice automático.
