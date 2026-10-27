'use client';

import { useActionState, useState } from 'react';
import { Trash2 } from 'lucide-react';
import FormError from '@/components/forms/FormError';
import { ZONES } from '@/lib/body';
import { money, parseAmount } from '@/lib/money';
import { saveQuote } from './actions';

let nextKey = 1;
const blank = () => ({ key: nextKey++, service_id: '', description: '', zone: '', sessions: '1', unit_price: '' });

export default function QuoteForm({ quote, initial, patients, services }) {
  const [state, action, pending] = useActionState(saveQuote, null);
  const v = state?.values ?? quote ?? initial;
  const [items, setItems] = useState(() => {
    const start = state?.values ? JSON.parse(state.values.items) : v.items;
    return start?.length ? start.map((i) => ({ ...blank(), ...i, sessions: String(i.sessions), unit_price: String(Number(i.unit_price) || i.unit_price || '') })) : [blank()];
  });
  const [discount, setDiscount] = useState(String(Number(v.discount_pct) || 0));

  const update = (key, patch) => setItems((list) => list.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  const pickService = (key, serviceId) => {
    const s = services.find((x) => String(x.id) === serviceId);
    update(key, s ? { service_id: serviceId, description: s.name, unit_price: String(Number(s.price)) } : { service_id: '' });
  };

  const subtotal = items.reduce((sum, i) => sum + (Number(i.sessions) || 0) * (parseAmount(i.unit_price) || 0), 0);
  const pct = Math.min(Math.max(parseAmount(discount) || 0, 0), 100);
  const total = Math.round(subtotal * (1 - pct / 100) * 100) / 100;

  return (
    <form action={action} className="form form--wide">
      <FormError state={state} />
      {quote && <input type="hidden" name="id" value={quote.id} />}
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      <div className="form-row">
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="patient_id">Paciente</label>
          <select className="mfl-input" id="patient_id" name="patient_id" defaultValue={v.patient_id ?? ''} required>
            <option value="" disabled>Elegí un paciente</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.last_name}, {p.first_name}</option>)}
          </select>
        </div>
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="valid_until">Válido hasta</label>
          <input className="mfl-input" type="date" id="valid_until" name="valid_until" defaultValue={v.valid_until ?? ''} />
        </div>
      </div>

      <div className="quote-items">
        {items.map((i, n) => (
          <fieldset key={i.key} className="quote-item">
            <legend className="sr-only">Línea {n + 1}</legend>
            <div className="mfl-field quote-item__service">
              <label className="mfl-field__label" htmlFor={`svc-${i.key}`}>Prestación</label>
              <select className="mfl-input" id={`svc-${i.key}`} value={i.service_id} onChange={(e) => pickService(i.key, e.target.value)}>
                <option value="">Otra (escribila abajo)</option>
                {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input
                className="mfl-input" aria-label="Descripción" placeholder="Descripción"
                value={i.description} onChange={(e) => update(i.key, { description: e.target.value })}
              />
            </div>
            <div className="mfl-field">
              <label className="mfl-field__label" htmlFor={`zone-${i.key}`}>Zona</label>
              <select className="mfl-input" id={`zone-${i.key}`} value={i.zone ?? ''} onChange={(e) => update(i.key, { zone: e.target.value })}>
                <option value="">Sin zona</option>
                {Object.entries(ZONES).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
              </select>
            </div>
            <div className="mfl-field quote-item__small">
              <label className="mfl-field__label" htmlFor={`ses-${i.key}`}>Sesiones</label>
              <input className="mfl-input mfl-num" id={`ses-${i.key}`} type="number" min="1" value={i.sessions} onChange={(e) => update(i.key, { sessions: e.target.value })} />
            </div>
            <div className="mfl-field quote-item__small">
              <label className="mfl-field__label" htmlFor={`price-${i.key}`}>Precio</label>
              <input className="mfl-input mfl-num" id={`price-${i.key}`} inputMode="decimal" value={i.unit_price} onChange={(e) => update(i.key, { unit_price: e.target.value })} />
            </div>
            <div className="quote-item__total mfl-num">{money((Number(i.sessions) || 0) * (parseAmount(i.unit_price) || 0))}</div>
            <button
              type="button" className="icon-btn" aria-label={`Quitar línea ${n + 1}`}
              disabled={items.length === 1} onClick={() => setItems((list) => list.filter((x) => x.key !== i.key))}
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </fieldset>
        ))}
        <button type="button" className="mfl-btn mfl-btn--ghost mfl-btn--inline" onClick={() => setItems((list) => [...list, blank()])}>
          Agregar otra prestación
        </button>
      </div>

      <div className="quote-sum">
        <div className="quote-sum__row"><span>Subtotal</span><span className="mfl-num">{money(subtotal)}</span></div>
        <div className="quote-sum__row">
          <label htmlFor="discount_pct">Descuento (%)</label>
          <input className="mfl-input mfl-num" id="discount_pct" name="discount_pct" inputMode="decimal" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </div>
        <div className="quote-sum__row quote-sum__total"><span>Total</span><span className="mfl-num">{money(total)}</span></div>
      </div>

      <div className="mfl-field">
        <label className="mfl-field__label" htmlFor="notes">Observaciones</label>
        <textarea className="mfl-input" id="notes" name="notes" rows={2} defaultValue={v.notes ?? ''} />
      </div>

      <div className="form-actions">
        <button type="submit" className="mfl-btn mfl-btn--primary" disabled={pending}>
          {quote ? 'Guardar presupuesto' : 'Crear presupuesto'}
        </button>
      </div>
    </form>
  );
}
