# Turnero Kinesiología

Sistema de gestión para consultorios de kinesiología, con la marca de MFL Systems: agenda por kinesiólogo, pacientes, evaluación con mapa corporal, evolución por sesión, presupuestos y cobros.

## Estado

| Paso | Qué incluye | Estado |
|------|-------------|--------|
| 1. Base y marca | Next.js + PostgreSQL, ingreso con usuario, menú, tema Día y Noche | Listo |
| 2. Pacientes y agenda | Kinesiólogos, ficha del paciente, agenda del día por kinesiólogo sin superposiciones, recordatorio por WhatsApp | Listo |
| 3. Evaluación e historia clínica | Mapa corporal (EVA 0 a 10), alertas, evolución por sesión | Pendiente |
| 4. Presupuestos y cobros | Prestaciones, obras sociales, presupuestos y saldos | Pendiente |

## Desarrollo local

Requisitos: Node 20 o más y una base PostgreSQL.

```bash
cp .env.example .env   # completá DATABASE_URL y el primer usuario
npm install
npm run migrate        # crea las tablas y el usuario administrador
npm run dev
```

`npm start` aplica el esquema (`db/schema.sql`, idempotente) y levanta la app. Si la base no tiene usuarios, crea el primero con `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

## Railway

Un servicio para la app (este repositorio) y un servicio PostgreSQL. Variables de la app:

- `DATABASE_URL`: referencia a la base (`${{Postgres.DATABASE_URL}}`)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`: primer usuario
- `CLINIC_NAME`: nombre del consultorio

`railway.json` define el build, el arranque y el chequeo de salud en `/api/salud`.

## Marca

Guía, tokens y logos de MFL Systems en `docs/marca/` y `public/marca/`. Los colores viven en `app/tokens.css` y los componentes (`mfl-btn`, `mfl-card`, `mfl-input`, `mfl-badge`, `mfl-slot`) en `app/marca.css`.
