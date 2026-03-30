import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { runner } from "node-pg-migrate";

const MIGRATIONS_DIR = path.join(process.cwd(), "migrations");

await main();

async function main() {
  loadEnvFiles();
  const action = process.argv[2] || "up";

  if (action === "redo") {
    await runMigrations("down", 1);
    await runMigrations("up", 1);
    return;
  }

  await runMigrations(action, readCount(action));
}

function loadEnvFiles() {
  loadEnvFile(".env");
  loadEnvFile(".env.local");
}

function loadEnvFile(filename) {
  const fullPath = path.join(process.cwd(), filename);

  if (!fs.existsSync(fullPath)) {
    return;
  }

  const lines = fs.readFileSync(fullPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    applyEnvLine(line);
  }
}

function applyEnvLine(line) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    return;
  }

  const separator = trimmed.indexOf("=");

  if (separator < 1) {
    return;
  }

  const key = trimmed.slice(0, separator).trim();
  const value = trimmed.slice(separator + 1).trim();
  process.env[key] = stripQuotes(value);
}

function stripQuotes(value) {
  const quoted = value.startsWith('"') && value.endsWith('"');
  const singleQuoted = value.startsWith("'") && value.endsWith("'");

  if (quoted || singleQuoted) {
    return value.slice(1, -1);
  }

  return value;
}

function readCount(action) {
  const rawCount = Number(process.argv[3]);

  if (Number.isInteger(rawCount) && rawCount > 0) {
    return rawCount;
  }

  return action === "down" ? 1 : Infinity;
}

async function runMigrations(direction, count) {
  await runner({
    checkOrder: true,
    count,
    databaseUrl: buildDatabaseConfig(),
    dir: MIGRATIONS_DIR,
    direction,
    log: logMessage,
    migrationsTable: "pgmigrations",
    verbose: true
  });
}

function buildDatabaseConfig() {
  const rawUrl = process.env.DATABASE_URL;

  if (!rawUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const url = new URL(rawUrl);

  return {
    database: url.pathname.replace(/^\//, ""),
    host: url.hostname,
    password: decodeURIComponent(url.password),
    port: Number(url.port || 5432),
    ssl: resolveSsl(url.hostname),
    user: decodeURIComponent(url.username)
  };
}

function resolveSsl(hostname) {
  if (isLocalHost(hostname)) {
    return false;
  }

  return { rejectUnauthorized: false };
}

function isLocalHost(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function logMessage(message) {
  console.log(message);
}
