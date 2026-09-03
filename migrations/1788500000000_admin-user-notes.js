export const shorthands = undefined;

export const up = (pgm) => pgm.sql(`
  CREATE TABLE admin_user_notes (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    author_login TEXT NOT NULL,
    body TEXT NOT NULL CHECK (char_length(btrim(body)) BETWEEN 1 AND 1000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  CREATE INDEX admin_user_notes_user_created_idx ON admin_user_notes(user_id, created_at DESC);
`);

export const down = (pgm) => pgm.sql("DROP TABLE admin_user_notes;");
