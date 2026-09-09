-- ============================================================
-- MIGRATION: SEC-C01 — Guard de Colunas Protegidas
-- Previne escalação de privilégio via mass assignment
-- Executar no Supabase SQL Editor
-- Data: 2026-08-26
-- ============================================================

-- 1. Trigger que bloqueia alteração de colunas sensíveis por não-admins
CREATE OR REPLACE FUNCTION public.guard_usuario_columns()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Colunas que NUNCA devem ser alteradas por não-admins
  IF NOT COALESCE(public.is_admin(), false) THEN
    -- Proteção de privilégio
    IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
      RAISE EXCEPTION 'Alteracao de is_admin requer privilegio de administrador';
    END IF;
    -- Proteção de moderação
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Alteracao de status requer privilegio de administrador';
    END IF;
    -- Proteção de integridade temporal
    IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
      RAISE EXCEPTION 'Alteracao de created_at nao e permitida';
    END IF;
    -- Proteção de slug (deve passar pela RPC claim_slug para respeitar cooldown)
    -- A RPC claim_slug seta 'app.bypass_slug_guard' = 'true' antes do UPDATE
    IF NEW.slug IS DISTINCT FROM OLD.slug
       AND current_setting('app.bypass_slug_guard', true) IS DISTINCT FROM 'true' THEN
      RAISE EXCEPTION 'Alteracao de slug deve ser feita via funcao claim_slug';
    END IF;
  END IF;
  RETURN NEW;
END; $$;

-- 2. Criar o trigger (drop first para idempotência)
DROP TRIGGER IF EXISTS trg_guard_usuario_columns ON public.usuarios;
CREATE TRIGGER trg_guard_usuario_columns
BEFORE UPDATE ON public.usuarios
FOR EACH ROW EXECUTE FUNCTION public.guard_usuario_columns();
