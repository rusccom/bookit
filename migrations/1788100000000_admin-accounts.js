/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

const upSql = `
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  login TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO admin_users (id, login, password_hash) VALUES
  (
    '4654c6b9-fc2a-4c22-9a70-08ec2f44b1b7',
    'ruscom',
    '$2b$12$qN/Yfhgznrb6KOjGwH1wE.7grWRiz9pKi/6wi5NXMV6n5Bth7PYsa'
  ),
  (
    'f63c5d8c-2828-44ea-a824-6010da49cd91',
    'alexnaliuka',
    '$2b$12$ZNuropcMZipcSH4yxBzviOwWrxcUQR6a4ZL5Zh4WhtqCqdj8V81r6'
  );
`;

const downSql = `DROP TABLE IF EXISTS admin_users;`;

export const up = (pgm) => pgm.sql(upSql);

export const down = (pgm) => pgm.sql(downSql);
