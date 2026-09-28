-- ============================================================
-- MIGRATION: TV-01 — Contate TV / Vitrine Digital (Digital Signage)
-- Sistema de Gestão Centralizada de Telas, Unidades, Playlists e Pareamento por QR Code
-- contate.site — Executar no Supabase SQL Editor
-- Data: 2026-09-28
-- ============================================================

-- 1. TABELA: tv_unidades (Lojas / Unidades Físicas / Franquias)
CREATE TABLE IF NOT EXISTS public.tv_unidades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  nome text NOT NULL,
  endereco text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tv_unidades_usuario_id ON public.tv_unidades(usuario_id);

-- 2. TABELA: tv_playlists (Coleções de slides / carrosséis temáticos)
CREATE TABLE IF NOT EXISTS public.tv_playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  nome text NOT NULL,
  descricao text,
  duracao_padrao_segundos integer NOT NULL DEFAULT 8 CHECK (duracao_padrao_segundos BETWEEN 3 AND 120),
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tv_playlists_usuario_id ON public.tv_playlists(usuario_id);

-- 3. TABELA: tv_slides (Slides individuais das playlists)
CREATE TABLE IF NOT EXISTS public.tv_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL REFERENCES public.tv_playlists(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'banner' CHECK (tipo IN ('banner', 'produto')),
  imagem_url text NOT NULL,
  titulo text,
  descricao text,
  preco text,
  badge_promocional text,
  duracao_segundos integer NOT NULL DEFAULT 8 CHECK (duracao_segundos BETWEEN 3 AND 120),
  ordem integer NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tv_slides_playlist_id ON public.tv_slides(playlist_id);
CREATE INDEX IF NOT EXISTS idx_tv_slides_ordem ON public.tv_slides(playlist_id, ordem) WHERE ativo = true;

-- 4. TABELA: telas_tv (Dispositivos físicos pareados)
CREATE TABLE IF NOT EXISTS public.telas_tv (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES public.usuarios(id) ON DELETE CASCADE,
  unidade_id uuid REFERENCES public.tv_unidades(id) ON DELETE SET NULL,
  nome text NOT NULL DEFAULT 'Minha Tela TV',
  setor text NOT NULL DEFAULT 'Geral',
  device_token text NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(24), 'hex'),
  orientacao text NOT NULL DEFAULT 'horizontal' CHECK (orientacao IN ('horizontal', 'vertical')),
  ticker_texto text,
  versao_conteudo integer NOT NULL DEFAULT 1,
  ultima_atividade timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_telas_tv_usuario_id ON public.telas_tv(usuario_id);
CREATE INDEX IF NOT EXISTS idx_telas_tv_device_token ON public.telas_tv(device_token);

-- 5. TABELA DE JUNÇÃO: tela_tv_playlists (Associação Múltiplas Playlists por Tela)
CREATE TABLE IF NOT EXISTS public.tela_tv_playlists (
  tela_id uuid NOT NULL REFERENCES public.telas_tv(id) ON DELETE CASCADE,
  playlist_id uuid NOT NULL REFERENCES public.tv_playlists(id) ON DELETE CASCADE,
  ordem integer NOT NULL DEFAULT 0,
  PRIMARY KEY (tela_id, playlist_id)
);

CREATE INDEX IF NOT EXISTS idx_tela_tv_playlists_tela ON public.tela_tv_playlists(tela_id);
CREATE INDEX IF NOT EXISTS idx_tela_tv_playlists_playlist ON public.tela_tv_playlists(playlist_id);

-- 6. TABELA: tv_sessoes_pareamento (Sessões temporárias com TTL de 15 minutos)
CREATE TABLE IF NOT EXISTS public.tv_sessoes_pareamento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_pin text NOT NULL UNIQUE,
  device_token text NOT NULL,
  status text NOT NULL DEFAULT 'aguardando' CHECK (status IN ('aguardando', 'conectado', 'expirado')),
  tela_id uuid REFERENCES public.telas_tv(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '15 minutes')
);

CREATE INDEX IF NOT EXISTS idx_tv_sessoes_codigo_pin ON public.tv_sessoes_pareamento(codigo_pin);
CREATE INDEX IF NOT EXISTS idx_tv_sessoes_device_token ON public.tv_sessoes_pareamento(device_token);

-- ============================================================
-- ATIVAÇÃO DE ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.tv_unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tv_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tv_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telas_tv ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tela_tv_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tv_sessoes_pareamento ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS: tv_unidades
DROP POLICY IF EXISTS "tv_unidades_owner_all" ON public.tv_unidades;
CREATE POLICY "tv_unidades_owner_all" ON public.tv_unidades
  FOR ALL TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- POLÍTICAS RLS: tv_playlists
DROP POLICY IF EXISTS "tv_playlists_owner_all" ON public.tv_playlists;
CREATE POLICY "tv_playlists_owner_all" ON public.tv_playlists
  FOR ALL TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- POLÍTICAS RLS: tv_slides
DROP POLICY IF EXISTS "tv_slides_owner_all" ON public.tv_slides;
CREATE POLICY "tv_slides_owner_all" ON public.tv_slides
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tv_playlists p
      WHERE p.id = tv_slides.playlist_id AND p.usuario_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tv_playlists p
      WHERE p.id = tv_slides.playlist_id AND p.usuario_id = auth.uid()
    )
  );

-- POLÍTICAS RLS: telas_tv
DROP POLICY IF EXISTS "telas_tv_owner_all" ON public.telas_tv;
CREATE POLICY "telas_tv_owner_all" ON public.telas_tv
  FOR ALL TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- POLÍTICAS RLS: tela_tv_playlists
DROP POLICY IF EXISTS "tela_tv_playlists_owner_all" ON public.tela_tv_playlists;
CREATE POLICY "tela_tv_playlists_owner_all" ON public.tela_tv_playlists
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.telas_tv t
      WHERE t.id = tela_tv_playlists.tela_id AND t.usuario_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.telas_tv t
      WHERE t.id = tela_tv_playlists.tela_id AND t.usuario_id = auth.uid()
    )
  );

-- POLÍTICAS RLS: tv_sessoes_pareamento
-- Leitura pública para checagem anônima do status de pareamento via token/PIN
DROP POLICY IF EXISTS "tv_sessoes_select_anon" ON public.tv_sessoes_pareamento;
CREATE POLICY "tv_sessoes_select_anon" ON public.tv_sessoes_pareamento
  FOR SELECT TO anon, authenticated
  USING (expires_at > now());

-- ============================================================
-- FUNÇÕES RPC SECURITY DEFINER (BLINDAGEM & AUDITORIA)
-- ============================================================

-- 1. Gerar Sessão de Pareamento para a TV
CREATE OR REPLACE FUNCTION public.tv_gerar_sessao_pareamento()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, auth, pg_temp
AS $$
DECLARE
  v_chars text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  v_pin text := '';
  v_i integer;
  v_token text;
  v_sessao_id uuid;
  v_expires_at timestamptz;
BEGIN
  -- Limpar sessões expiradas antigas
  DELETE FROM public.tv_sessoes_pareamento WHERE expires_at < now();

  -- Gerar PIN alfanumérico de 6 caracteres seguro (sem caracteres ambíguos)
  LOOP
    v_pin := '';
    FOR v_i IN 1..6 LOOP
      v_pin := v_pin || substr(v_chars, floor(random() * length(v_chars) + 1)::integer, 1);
    END LOOP;

    -- Verificar se já existe PIN ativo igual
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.tv_sessoes_pareamento 
      WHERE codigo_pin = v_pin AND status = 'aguardando' AND expires_at > now()
    );
  END LOOP;

  v_token := encode(extensions.gen_random_bytes(24), 'hex');
  v_expires_at := now() + interval '15 minutes';

  INSERT INTO public.tv_sessoes_pareamento (codigo_pin, device_token, status, expires_at)
  VALUES (v_pin, v_token, 'aguardando', v_expires_at)
  RETURNING id INTO v_sessao_id;

  RETURN jsonb_build_object(
    'sessao_id', v_sessao_id,
    'codigo_pin', v_pin,
    'device_token', v_token,
    'expires_at', v_expires_at
  );
END;
$$;

-- 2. Confirmar Pareamento da TV pelo Usuário Autenticado
CREATE OR REPLACE FUNCTION public.tv_confirmar_pareamento(
  p_pin text,
  p_nome text,
  p_unidade_id uuid DEFAULT NULL,
  p_setor text DEFAULT 'Geral',
  p_orientacao text DEFAULT 'horizontal',
  p_ticker text DEFAULT NULL,
  p_playlist_ids uuid[] DEFAULT ARRAY[]::uuid[]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_usuario_id uuid := auth.uid();
  v_sessao public.tv_sessoes_pareamento%ROWTYPE;
  v_tela_id uuid;
  v_playlist_id uuid;
  v_ordem integer := 0;
BEGIN
  IF v_usuario_id IS NULL THEN
    RAISE EXCEPTION 'Acesso negado. Usuário não autenticado.';
  END IF;

  -- Buscar sessão ativa pelo PIN (case-insensitive)
  SELECT * INTO v_sessao
  FROM public.tv_sessoes_pareamento
  WHERE UPPER(codigo_pin) = UPPER(p_pin)
    AND status = 'aguardando'
    AND expires_at > now()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Código PIN inválido, já utilizado ou expirado. Gere um novo na tela da TV.';
  END IF;

  -- Criar o registro físico da tela vinculado ao usuário
  INSERT INTO public.telas_tv (
    usuario_id,
    unidade_id,
    nome,
    setor,
    device_token,
    orientacao,
    ticker_texto,
    versao_conteudo,
    ultima_atividade
  ) VALUES (
    v_usuario_id,
    p_unidade_id,
    COALESCE(NULLIF(trim(p_nome), ''), 'Tela TV'),
    COALESCE(NULLIF(trim(p_setor), ''), 'Geral'),
    v_sessao.device_token,
    CASE WHEN p_orientacao = 'vertical' THEN 'vertical' ELSE 'horizontal' END,
    NULLIF(trim(p_ticker), ''),
    1,
    now()
  ) RETURNING id INTO v_tela_id;

  -- Vincular playlists selecionadas
  IF p_playlist_ids IS NOT NULL AND array_length(p_playlist_ids, 1) > 0 THEN
    FOREACH v_playlist_id IN ARRAY p_playlist_ids LOOP
      -- Validar se a playlist pertence de fato ao usuário autenticado
      IF EXISTS (SELECT 1 FROM public.tv_playlists WHERE id = v_playlist_id AND usuario_id = v_usuario_id) THEN
        INSERT INTO public.tela_tv_playlists (tela_id, playlist_id, ordem)
        VALUES (v_tela_id, v_playlist_id, v_ordem)
        ON CONFLICT DO NOTHING;
        v_ordem := v_ordem + 1;
      END IF;
    END LOOP;
  END IF;

  -- Atualizar status da sessão de pareamento
  UPDATE public.tv_sessoes_pareamento
  SET status = 'conectado',
      tela_id = v_tela_id
  WHERE id = v_sessao.id;

  RETURN jsonb_build_object(
    'success', true,
    'tela_id', v_tela_id,
    'device_token', v_sessao.device_token,
    'mensagem', 'Tela vinculada com sucesso!'
  );
END;
$$;

-- 3. Obter Conteúdo e Slides para a TV (Via Device Token)
CREATE OR REPLACE FUNCTION public.tv_obter_slides_tela(p_device_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_tela public.telas_tv%ROWTYPE;
  v_slides jsonb;
BEGIN
  -- Buscar a tela e atualizar heartbeat de atividade
  SELECT * INTO v_tela
  FROM public.telas_tv
  WHERE device_token = p_device_token;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valido', false, 'erro', 'Dispositivo não encontrado ou desvinculado.');
  END IF;

  -- Atualiza heartbeat sem bloquear
  UPDATE public.telas_tv
  SET ultima_atividade = now()
  WHERE id = v_tela.id;

  -- Buscar todos os slides ativos das playlists vinculadas em ordem
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', s.id,
      'playlist_id', s.playlist_id,
      'playlist_nome', p.nome,
      'tipo', s.tipo,
      'imagem_url', s.imagem_url,
      'titulo', s.titulo,
      'descricao', s.descricao,
      'preco', s.preco,
      'badge_promocional', s.badge_promocional,
      'duracao_segundos', COALESCE(s.duracao_segundos, p.duracao_padrao_segundos, 8),
      'ordem', s.ordem
    ) ORDER BY tp.ordem ASC, s.ordem ASC
  ), '[]'::jsonb) INTO v_slides
  FROM public.tela_tv_playlists tp
  JOIN public.tv_playlists p ON p.id = tp.playlist_id
  JOIN public.tv_slides s ON s.playlist_id = p.id
  WHERE tp.tela_id = v_tela.id
    AND p.ativo = true
    AND s.ativo = true;

  RETURN jsonb_build_object(
    'valido', true,
    'tela_id', v_tela.id,
    'nome', v_tela.nome,
    'setor', v_tela.setor,
    'orientacao', v_tela.orientacao,
    'ticker_texto', v_tela.ticker_texto,
    'versao_conteudo', v_tela.versao_conteudo,
    'slides', v_slides
  );
END;
$$;

-- 4. Disparar Atualização para uma ou todas as Telas de um Usuário
CREATE OR REPLACE FUNCTION public.tv_disparar_atualizacao(
  p_tela_id uuid DEFAULT NULL,
  p_setor text DEFAULT NULL,
  p_unidade_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_usuario_id uuid := auth.uid();
  v_afetadas integer;
BEGIN
  IF v_usuario_id IS NULL THEN
    RAISE EXCEPTION 'Acesso negado. Usuário não autenticado.';
  END IF;

  UPDATE public.telas_tv
  SET versao_conteudo = versao_conteudo + 1
  WHERE usuario_id = v_usuario_id
    AND (p_tela_id IS NULL OR id = p_tela_id)
    AND (p_setor IS NULL OR setor = p_setor)
    AND (p_unidade_id IS NULL OR unidade_id = p_unidade_id);

  GET DIAGNOSTICS v_afetadas = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'telas_atualizadas', v_afetadas
  );
END;
$$;

-- 5. Bucket de Storage para Banners e Slides de TV (tv-media)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tv-media',
  'tv-media',
  true,
  10485760, -- 10MB por arquivo (alta definição para TVs 4K)
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

-- Políticas do Storage tv-media
DROP POLICY IF EXISTS "tv_media_public_select" ON storage.objects;
CREATE POLICY "tv_media_public_select" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'tv-media');

DROP POLICY IF EXISTS "tv_media_user_upload" ON storage.objects;
CREATE POLICY "tv_media_user_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'tv-media' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "tv_media_user_delete" ON storage.objects;
CREATE POLICY "tv_media_user_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'tv-media' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
