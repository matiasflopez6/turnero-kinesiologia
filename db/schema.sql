-- Esquema idempotente: se aplica en cada arranque.

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'admin',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);

-- Paso 2: kinesiólogos, pacientes y turnos

CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS professionals (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT,
  active     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patients (
  id           SERIAL PRIMARY KEY,
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL,
  dni          TEXT,
  phone        TEXT,
  email        TEXT,
  birth_date   DATE,
  health_plan  TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS patients_last_name_idx ON patients (lower(last_name));

CREATE TABLE IF NOT EXISTS appointments (
  id              SERIAL PRIMARY KEY,
  patient_id      INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  professional_id INTEGER NOT NULL REFERENCES professionals(id),
  starts_at       TIMESTAMPTZ NOT NULL,
  ends_at         TIMESTAMPTZ NOT NULL,
  status          TEXT NOT NULL DEFAULT 'sin_confirmar'
                  CHECK (status IN ('sin_confirmar', 'confirmado', 'cancelado')),
  notes           TEXT,
  reminded_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS appointments_starts_at_idx ON appointments (starts_at);
CREATE INDEX IF NOT EXISTS appointments_patient_idx ON appointments (patient_id);

-- Un kinesiólogo no puede tener dos turnos activos que se pisen.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'appointments_no_overlap') THEN
    ALTER TABLE appointments ADD CONSTRAINT appointments_no_overlap
      EXCLUDE USING gist (professional_id WITH =, tstzrange(starts_at, ends_at) WITH &&)
      WHERE (status <> 'cancelado');
  END IF;
END $$;
