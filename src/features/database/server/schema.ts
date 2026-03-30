export const schemaSql = `
CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('customer', 'owner')),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY,
  owner_user_id UUID NOT NULL UNIQUE REFERENCES app_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookable_units (
  id UUID PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'tennis_court',
  title TEXT NOT NULL,
  slot_minutes INTEGER NOT NULL DEFAULT 30 CHECK (slot_minutes = 30),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS availability_rules (
  id UUID PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES bookable_units(id) ON DELETE CASCADE,
  weekday INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_minutes INTEGER NOT NULL CHECK (start_minutes BETWEEN 0 AND 1410),
  end_minutes INTEGER NOT NULL CHECK (end_minutes BETWEEN 30 AND 1440),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_rule_range CHECK (start_minutes < end_minutes)
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES bookable_units(id) ON DELETE CASCADE,
  customer_user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_by_user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
  source TEXT NOT NULL CHECK (
    source IN ('web_customer', 'owner_manual', 'telegram_llm')
  ),
  status TEXT NOT NULL CHECK (
    status IN ('pending_confirmation', 'confirmed', 'cancelled')
  ),
  note TEXT NOT NULL DEFAULT '',
  telegram_chat_id BIGINT,
  booking_date DATE NOT NULL,
  start_minutes INTEGER NOT NULL CHECK (start_minutes BETWEEN 0 AND 1410),
  end_minutes INTEGER NOT NULL CHECK (end_minutes BETWEEN 30 AND 1440),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_booking_range CHECK (start_minutes < end_minutes)
);

CREATE TABLE IF NOT EXISTS telegram_profiles (
  chat_id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'owner')),
  stage TEXT NOT NULL DEFAULT 'collect_name',
  pending_name TEXT,
  pending_phone TEXT,
  pending_code_hash TEXT,
  code_expires_at TIMESTAMPTZ,
  pending_intent JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

`;
