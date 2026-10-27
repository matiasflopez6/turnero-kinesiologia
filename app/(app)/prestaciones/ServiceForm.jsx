'use client';

import { useActionState } from 'react';
import FormError from '@/components/forms/FormError';
import { saveService } from './actions';

export default function ServiceForm({ service }) {
  const [state, action, pending] = useActionState(saveService, null);
  const v = state?.values ?? service ?? {};
  return (
    <form action={action} className="form">
      <FormError state={state} />
      {service && <input type="hidden" name="id" value={service.id} />}
      <div className="form-row">
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="name">Prestación</label>
          <input className="mfl-input" id="name" name="name" defaultValue={v.name} placeholder="Por ejemplo: sesión de kinesiología" required />
        </div>
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="price">Precio por sesión</label>
          <input className="mfl-input mfl-num" id="price" name="price" inputMode="decimal" defaultValue={v.price != null ? String(Number(v.price)) : ''} placeholder="18000" required />
        </div>
      </div>
      {service && (
        <label className="check">
          <input type="checkbox" name="active" defaultChecked={v.active} />
          Disponible para presupuestos
        </label>
      )}
      <div className="form-actions">
        <button type="submit" className="mfl-btn mfl-btn--primary" disabled={pending}>
          {service ? 'Guardar cambios' : 'Agregar prestación'}
        </button>
      </div>
    </form>
  );
}
