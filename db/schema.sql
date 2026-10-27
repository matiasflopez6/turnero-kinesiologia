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

-- Paso 3: evaluación e historia clínica

ALTER TABLE patients ADD COLUMN IF NOT EXISTS diagnosis TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS referred_by TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS alerts TEXT;

-- Mapa corporal: estado actual de cada zona del paciente.
CREATE TABLE IF NOT EXISTS body_findings (
  id         SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  zone       TEXT NOT NULL,
  finding    TEXT NOT NULL CHECK (finding IN ('dolor', 'contractura', 'limitacion')),
  eva        SMALLINT CHECK (eva BETWEEN 0 AND 10),
  notes      TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (patient_id, zone, finding)
);

-- Evolución: una entrada por evaluación o sesión.
CREATE TABLE IF NOT EXISTS clinical_notes (
  id              SERIAL PRIMARY KEY,
  patient_id      INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  professional_id INTEGER REFERENCES professionals(id),
  note_date       DATE NOT NULL,
  kind            TEXT NOT NULL DEFAULT 'sesion' CHECK (kind IN ('evaluacion', 'sesion')),
  zone            TEXT,
  eva             SMALLINT CHECK (eva BETWEEN 0 AND 10),
  body            TEXT NOT NULL,
  created_by      INTEGER REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS clinical_notes_patient_idx ON clinical_notes (patient_id, note_date DESC);

-- Paso 4: presupuestos y cobros

CREATE TABLE IF NOT EXISTS services (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  price      NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  active     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quotes (
  id           SERIAL PRIMARY KEY,
  patient_id   INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'aceptado', 'rechazado')),
  discount_pct NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (discount_pct BETWEEN 0 AND 100),
  valid_until  DATE,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quotes_patient_idx ON quotes (patient_id);

CREATE TABLE IF NOT EXISTS quote_items (
  id          SERIAL PRIMARY KEY,
  quote_id    INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  service_id  INTEGER REFERENCES services(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  zone        TEXT,
  sessions    INTEGER NOT NULL DEFAULT 1 CHECK (sessions > 0),
  unit_price  NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0)
);

CREATE TABLE IF NOT EXISTS payments (
  id         SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  paid_on    DATE NOT NULL,
  amount     NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  method     TEXT NOT NULL CHECK (method IN ('efectivo', 'transferencia', 'debito', 'credito', 'mercadopago', 'obra_social')),
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_patient_idx ON payments (patient_id);
CREATE INDEX IF NOT EXISTS payments_paid_on_idx ON payments (paid_on);

-- Total de cada presupuesto con el descuento aplicado.
CREATE OR REPLACE VIEW quote_totals AS
SELECT q.id AS quote_id,
       coalesce(sum(i.sessions * i.unit_price), 0) AS subtotal,
       round(coalesce(sum(i.sessions * i.unit_price), 0) * (1 - q.discount_pct / 100), 2) AS total
  FROM quotes q LEFT JOIN quote_items i ON i.quote_id = q.id
 GROUP BY q.id;

-- Saldo: lo presupuestado y aceptado menos lo cobrado.
CREATE OR REPLACE VIEW patient_balances AS
SELECT p.id AS patient_id,
       coalesce((SELECT sum(t.total) FROM quotes q JOIN quote_totals t ON t.quote_id = q.id
                  WHERE q.patient_id = p.id AND q.status = 'aceptado'), 0) AS charged,
       coalesce((SELECT sum(amount) FROM payments WHERE patient_id = p.id), 0) AS paid
  FROM patients p;
