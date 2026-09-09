-- ============================================================
-- MIGRATION: SEC-M04 — Auditoria de Ações Administrativas
-- Cria tabela de log e triggers automáticos de auditoria
-- Executar no Supabase SQL Editor (RISCO ZERO — apenas adiciona)
-- Data: 2026-08-26
-- ============================================================

-- 1. Tabela de auditoria (append-only — sem UPDATE/DELETE permitido)
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL,
  target_id uuid,
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- 2. Policies: apenas admins leem, ninguém altera/deleta
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_audit_log' AND policyname = 'audit_select_admin'
  ) THEN
    CREATE POLICY "audit_select_admin" ON admin_audit_log
      FOR SELECT USING (public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_audit_log' AND policyname = 'audit_no_delete'
  ) THEN
    CREATE POLICY "audit_no_delete" ON admin_audit_log
      FOR DELETE USING (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_audit_log' AND policyname = 'audit_no_update'
  ) THEN
    CREATE POLICY "audit_no_update" ON admin_audit_log
      FOR UPDATE USING (false);
  END IF;

  -- Policy de INSERT: apenas o trigger (SECURITY DEFINER) pode inserir
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_audit_log' AND policyname = 'audit_insert_system'
  ) THEN
    CREATE POLICY "audit_insert_system" ON admin_audit_log
      FOR INSERT WITH CHECK (false);  -- Bloqueado via API; trigger é SECURITY DEFINER
  END IF;
END $$;

-- 3. Trigger de auditoria para UPDATE (loga quando admin altera outro usuário)
CREATE OR REPLACE FUNCTION public.log_admin_action()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF public.is_admin() AND auth.uid() IS DISTINCT FROM NEW.id THEN
    INSERT INTO admin_audit_log (actor_id, target_id, action, details)
    VALUES (
      auth.uid(),
      NEW.id,
      TG_OP,
      jsonb_build_object(
        'changes', to_jsonb(NEW) - to_jsonb(OLD)
      )
    );
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_admin_audit ON public.usuarios;
CREATE TRIGGER trg_admin_audit
AFTER UPDATE ON public.usuarios
FOR EACH ROW EXECUTE FUNCTION public.log_admin_action();

-- 4. Trigger de auditoria para DELETE
CREATE OR REPLACE FUNCTION public.log_admin_delete()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF public.is_admin() AND auth.uid() IS DISTINCT FROM OLD.id THEN
    INSERT INTO admin_audit_log (actor_id, target_id, action, details)
    VALUES (auth.uid(), OLD.id, 'DELETE', to_jsonb(OLD));
  END IF;
  RETURN OLD;
END; $$;

DROP TRIGGER IF EXISTS trg_admin_audit_delete ON public.usuarios;
CREATE TRIGGER trg_admin_audit_delete
AFTER DELETE ON public.usuarios
FOR EACH ROW EXECUTE FUNCTION public.log_admin_delete();
