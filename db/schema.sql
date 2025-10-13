-- Schema definition for the EDX Trade-Off project

CREATE TABLE IF NOT EXISTS "User" (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  api_key TEXT NOT NULL,
  api_secret TEXT NOT NULL,
  avatar TEXT
);

CREATE TABLE IF NOT EXISTS balenciaga (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  balance NUMERIC(20, 8) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS balenciaga_user_id_timestamp_idx
  ON balenciaga (user_id, timestamp);
