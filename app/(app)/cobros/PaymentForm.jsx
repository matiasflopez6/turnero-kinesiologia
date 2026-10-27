'use client';

import { useActionState } from 'react';
import FormError from '@/components/forms/FormError';
import { METHODS } from '@/lib/money';
import { savePayment } from './actions';

export default function PaymentForm({ initial, patients }) {
  const [state, action, pending] = useActionState(savePayment, null);
  const v = state?.values ?? initial;
  return (
    <form action={action} className="form">
      <FormError state={state} />
      <div className="mfl-field">
        <label className="mfl-field__label" htmlFor="patient_id">Paciente</label>
        <select className="mfl-input" id="patient_id" name="patient_id" defaultValue={v.patient_id ?? ''} required>
          <option value="" disabled>Elegí un paciente</option>
          {patients.map((p) => <option key={p.id} value={p.id}>{p.last_name}, {p.first_name}</option>)}
        </select>
      </div>
      <div className="form-row">
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="amount">Monto</label>
          <input className="mfl-input mfl-num" id="amount" name="amount" inputMode="decimal" defaultValue={v.amount ?? ''} placeholder="18000" required />
          {v.suggested && <span className="mfl-field__help">Saldo pendiente: {v.suggested}</span>}
        </div>
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="method">Medio de pago</label>
          <select className="mfl-input" id="method" name="method" defaultValue={v.method ?? 'efectivo'}>
            {Object.entries(METHODS).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
          </select>
        </div>
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="paid_on">Fecha</label>
          <input className="mfl-input" type="date" id="paid_on" name="paid_on" defaultValue={v.paid_on} required />
        </div>
      </div>
      <div className="mfl-field">
        <label className="mfl-field__label" htmlFor="notes">Nota</label>
        <input className="mfl-input" id="notes" name="notes" defaultValue={v.notes ?? ''} placeholder="Por ejemplo: seña de 5 sesiones" />
      </div>
      <div className="form-actions">
        <button type="submit" className="mfl-btn mfl-btn--primary" disabled={pending}>Registrar cobro</button>
      </div>
    </form>
  );
}
