const ars = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

// "$ 223.000". Los centavos se redondean: los precios del consultorio son en pesos enteros.
export function money(value) {
  return ars.format(Math.round(Number(value) || 0));
}

export const METHODS = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  debito: 'Tarjeta de débito',
  credito: 'Tarjeta de crédito',
  mercadopago: 'Mercado Pago',
  obra_social: 'Obra social',
};

export const QUOTE_STATUS = {
  pendiente: { label: 'Pendiente', badge: 'alert' },
  aceptado: { label: 'Aceptado', badge: 'gain' },
  rechazado: { label: 'Rechazado', badge: 'error' },
};

// Acepta "12.500", "12500,50" o "12500.5".
export function parseAmount(text) {
  let s = String(text ?? '').trim().replace(/[$\s]/g, '');
  if (!s) return null;
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}
