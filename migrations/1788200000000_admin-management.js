/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

const upSql = `
ALTER TABLE app_users
  ADD COLUMN is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN blocked_at TIMESTAMPTZ,
  ADD COLUMN blocked_by_admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL;

ALTER TABLE app_users
  ADD CONSTRAINT app_users_belarus_phone_check
  CHECK (phone IS NULL OR phone ~ '^\\+375(25|29|33|44)[0-9]{7}$') NOT VALID;

ALTER TABLE venues ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE bookable_units ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE admin_users
  ADD COLUMN failed_login_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN locked_until TIMESTAMPTZ,
  ADD COLUMN two_factor_secret TEXT,
  ADD COLUMN two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  user_agent TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ
);

CREATE INDEX admin_sessions_admin_user_id_idx
  ON admin_sessions(admin_user_id, expires_at DESC);

CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY,
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  admin_login TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX admin_audit_log_created_at_idx
  ON admin_audit_log(created_at DESC);
`;

const downSql = `
DROP TABLE IF EXISTS admin_audit_log;
DROP TABLE IF EXISTS admin_sessions;

ALTER TABLE admin_users
  DROP COLUMN IF EXISTS updated_at,
  DROP COLUMN IF EXISTS two_factor_enabled,
  DROP COLUMN IF EXISTS two_factor_secret,
  DROP COLUMN IF EXISTS locked_until,
  DROP COLUMN IF EXISTS failed_login_count;

ALTER TABLE bookable_units DROP COLUMN IF EXISTS is_active;
ALTER TABLE venues DROP COLUMN IF EXISTS is_active;

ALTER TABLE app_users
  DROP CONSTRAINT IF EXISTS app_users_belarus_phone_check,
  DROP COLUMN IF EXISTS blocked_by_admin_id,
  DROP COLUMN IF EXISTS blocked_at,
  DROP COLUMN IF EXISTS is_blocked;
`;

export const up = (pgm) => pgm.sql(upSql);

export const down = (pgm) => pgm.sql(downSql);
