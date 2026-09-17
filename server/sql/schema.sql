-- PostgreSQL schema for the habit tracker

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL CHECK (length(trim(name)) > 0),
  description TEXT NOT NULL DEFAULT '',
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_habits_completed ON habits (completed);

-- Keep updated_at current whenever a habit is modified.
CREATE OR REPLACE FUNCTION set_habits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS habits_updated_at ON habits;
CREATE TRIGGER habits_updated_at
BEFORE UPDATE ON habits
FOR EACH ROW
EXECUTE FUNCTION set_habits_updated_at();

-- CREATE
-- INSERT INTO habits (name, description)
-- VALUES ($1, $2)
-- RETURNING id, name, description, completed, created_at, updated_at;

-- READ all
-- SELECT id, name, description, completed, created_at, updated_at
-- FROM habits
-- ORDER BY created_at DESC;

-- READ one
-- SELECT id, name, description, completed, created_at, updated_at
-- FROM habits
-- WHERE id = $1;

-- UPDATE
-- UPDATE habits
-- SET name = $1, description = $2, completed = $3
-- WHERE id = $4
-- RETURNING id, name, description, completed, created_at, updated_at;

-- DELETE
-- DELETE FROM habits
-- WHERE id = $1
-- RETURNING id;
