import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Railway lo usa para saber si el servicio está listo.
export async function GET() {
  try {
    await query('SELECT 1');
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: 'Sin conexión a la base de datos' }, { status: 503 });
  }
}
