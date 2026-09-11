-- ============================================================
-- MIGRATION: Auditoria de Segurança & Otimização de Performance
-- Ciclo Setembro 2026 — contate.site
-- Otimizada com NOT VALID, subqueries e Índices para economizar Disk IO
-- ============================================================

-- ------------------------------------------------------------
-- PARTE 1: Constraint de Validação de URL na tabela blocos_links (SEC-02)
-- ------------------------------------------------------------
ALTER TABLE public.blocos_links DROP CONSTRAINT IF EXISTS blocos_links_url_check;

-- Adiciona a constraint como NOT VALID (instantâneo, sem segurar lock exclusivo)
ALTER TABLE public.blocos_links ADD CONSTRAINT blocos_links_url_check
  CHECK (url ~* '^https?://[^\s]+$') NOT VALID;

-- Valida os registros em segundo plano sem bloquear leituras/escritas
ALTER TABLE public.blocos_links VALIDATE CONSTRAINT blocos_links_url_check;


-- ------------------------------------------------------------
-- PARTE 2: Índices para Redução Drástica de Consumo de Disco (Disk IO)
-- Evita full table scans nas consultas de RLS e queries do Dashboard
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_blocos_links_usuario_id 
  ON public.blocos_links (usuario_id);

CREATE INDEX IF NOT EXISTS idx_slugs_reservados_usuario_id 
  ON public.slugs_reservados (usuario_id);

CREATE INDEX IF NOT EXISTS idx_slugs_reservados_slug 
  ON public.slugs_reservados (slug);


-- ------------------------------------------------------------
-- PARTE 3: Políticas RLS Otimizadas para blocos_links (SEC-04 & SEC-05)
-- Usa (SELECT auth.uid()) e (SELECT public.is_admin()) para cache por query
-- ------------------------------------------------------------
-- 3.1 Leitura: links ativos são públicos; inativos só para o dono ou admin
DROP POLICY IF EXISTS "blocos_links_select_public" ON public.blocos_links;
CREATE POLICY "blocos_links_select_public" ON public.blocos_links
  FOR SELECT
  USING (
    ativo = true 
    OR (SELECT auth.uid()) = usuario_id 
    OR (SELECT public.is_admin())
  );

-- 3.2 Atualização: dono ou administrador
DROP POLICY IF EXISTS "blocos_links_update_own" ON public.blocos_links;
CREATE POLICY "blocos_links_update_own" ON public.blocos_links
  FOR UPDATE
  USING ((SELECT auth.uid()) = usuario_id OR (SELECT public.is_admin()))
  WITH CHECK ((SELECT auth.uid()) = usuario_id OR (SELECT public.is_admin()));

-- 3.3 Deleção: dono ou administrador
DROP POLICY IF EXISTS "blocos_links_delete_own" ON public.blocos_links;
CREATE POLICY "blocos_links_delete_own" ON public.blocos_links
  FOR DELETE
  USING ((SELECT auth.uid()) = usuario_id OR (SELECT public.is_admin()));


-- ------------------------------------------------------------
-- PARTE 4: Atualização da Blocklist de Slugs Reservados (SEC-07)
-- ------------------------------------------------------------
ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS slug_format_check;

ALTER TABLE public.usuarios ADD CONSTRAINT slug_format_check
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
        'help', 'about', 'terms', 'termos', 'privacy', 'privacidade',
        'legal', 'static', 'assets', 'public', 'images', 'css', 'js',
        'null', 'undefined', 'root', 'system', 'support',
        'robots.txt', 'sitemap.xml', 'favicon.ico'
      )
    )
  ) NOT VALID;

ALTER TABLE public.usuarios VALIDATE CONSTRAINT slug_format_check;
