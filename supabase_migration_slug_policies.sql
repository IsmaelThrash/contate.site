-- ============================================================
-- MIGRATION: Segurança — Políticas e Limite Anti-Acumulador
-- Executar no Supabase SQL Editor
-- ============================================================

-- 1. Política RLS (Row Level Security) para a tabela de reservas
-- Permite que o usuário consulte apenas os slugs que ELE reservou (para a tela de Danger Zone).
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'slugs_reservados' AND policyname = 'Permitir leitura ao dono do slug reservado'
  ) THEN
    CREATE POLICY "Permitir leitura ao dono do slug reservado"
    ON slugs_reservados
    FOR SELECT
    USING (auth.uid() = usuario_id);
  END IF;
END $$;

-- 2. Atualização da Função claim_slug
-- Comportamento Novo: O usuário só pode ter UMA reserva por vez.
CREATE OR REPLACE FUNCTION claim_slug(p_user_id uuid, p_slug text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_slug_atual text;
  v_reserva_usuario_id uuid;
BEGIN
  -- Passo A: Verificar se o novo slug desejado está travado no cooldown por OUTRO usuário
  SELECT usuario_id INTO v_reserva_usuario_id
  FROM slugs_reservados
  WHERE slug = p_slug AND liberado_em > now()
  ORDER BY liberado_em DESC
  LIMIT 1;

  IF FOUND AND v_reserva_usuario_id != p_user_id THEN
    -- Slug reservado por outra pessoa e ainda dentro dos 30 dias
    RETURN false;
  END IF;

  -- Passo B: Descobrir o slug atual do usuário (se ele já tiver um)
  SELECT slug INTO v_slug_atual FROM usuarios WHERE id = p_user_id;

  -- Passo C: Regra Anti-Acumulador
  IF v_slug_atual IS NOT NULL AND v_slug_atual != p_slug THEN
    -- Apaga brutalmente qualquer reserva anterior que esse usuário possua no cofre
    -- Isso garante que ele só tenha no máximo 1 slug reservado!
    DELETE FROM slugs_reservados WHERE usuario_id = p_user_id;
    
    -- Guarda APENAS o slug antigo mais recente no cofre
    INSERT INTO slugs_reservados (slug, usuario_id, liberado_em)
    VALUES (v_slug_atual, p_user_id, now() + interval '30 days');
  END IF;

  -- Passo D: Executa o UPDATE do novo slug.
  UPDATE usuarios
    SET slug = p_slug,
        status = 1
  WHERE id = p_user_id;

  -- Passo E: Remover a reserva caso o usuário esteja "recuperando" um slug dele próprio do cofre
  DELETE FROM slugs_reservados WHERE slug = p_slug AND usuario_id = p_user_id;

  RETURN FOUND;
EXCEPTION
  WHEN unique_violation THEN
    RETURN false;
END;
$$;
