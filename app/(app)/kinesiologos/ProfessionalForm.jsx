'use client';

import { useActionState } from 'react';
import FormError from '@/components/forms/FormError';
import { saveProfessional } from './actions';

export default function ProfessionalForm({ professional }) {
  const [state, action, pending] = useActionState(saveProfessional, null);
  const v = state?.values ?? professional ?? {};
  return (
    <form action={action} className="form">
      <FormError state={state} />
      {professional && <input type="hidden" name="id" value={professional.id} />}
      <div className="form-row">
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="name">Nombre y apellido</label>
          <input className="mfl-input" id="name" name="name" defaultValue={v.name} required />
        </div>
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="phone">Teléfono</label>
          <input className="mfl-input" id="phone" name="phone" type="tel" defaultValue={v.phone ?? ''} />
        </div>
      </div>
      {professional && (
        <label className="check">
          <input type="checkbox" name="active" defaultChecked={v.active} />
          Atiende pacientes (aparece en la agenda)
        </label>
      )}
      <div className="form-actions">
        <button type="submit" className="mfl-btn mfl-btn--primary" disabled={pending}>
          {professional ? 'Guardar cambios' : 'Agregar kinesiólogo'}
        </button>
      </div>
    </form>
  );
}
