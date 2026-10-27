'use client';

import { useActionState } from 'react';
import FormError from '@/components/forms/FormError';
import { savePatient } from './actions';

function Field({ name, label, help, values, ...props }) {
  return (
    <div className="mfl-field">
      <label className="mfl-field__label" htmlFor={name}>{label}</label>
      <input className="mfl-input" id={name} name={name} defaultValue={values?.[name] ?? ''} {...props} />
      {help && <span className="mfl-field__help">{help}</span>}
    </div>
  );
}

export default function PatientForm({ patient }) {
  const [state, action, pending] = useActionState(savePatient, null);
  const v = state?.values ?? patient ?? {};
  return (
    <form action={action} className="form">
      <FormError state={state} />
      {patient && <input type="hidden" name="id" value={patient.id} />}
      <div className="form-row">
        <Field name="first_name" label="Nombre" values={v} required autoComplete="off" />
        <Field name="last_name" label="Apellido" values={v} required autoComplete="off" />
      </div>
      <div className="form-row">
        <Field name="phone" label="Celular" type="tel" values={v} help="Con código de área, sin 0 ni 15. Lo usamos para el WhatsApp." />
        <Field name="dni" label="DNI" inputMode="numeric" values={v} />
      </div>
      <div className="form-row">
        <Field name="health_plan" label="Obra social o prepaga" values={v} help="Dejalo vacío si es particular." />
        <Field name="birth_date" label="Fecha de nacimiento" type="date" values={v} />
      </div>
      <Field name="email" label="Email" type="email" values={v} />
      <div className="mfl-field">
        <label className="mfl-field__label" htmlFor="notes">Notas</label>
        <textarea className="mfl-input" id="notes" name="notes" rows={3} defaultValue={v.notes ?? ''} />
      </div>
      <h3 className="title form-section">Clínica</h3>
      <div className="mfl-field">
        <label className="mfl-field__label" htmlFor="diagnosis">Diagnóstico</label>
        <input className="mfl-input" id="diagnosis" name="diagnosis" defaultValue={v.diagnosis ?? ''} placeholder="Por ejemplo: lumbalgia mecánica" />
      </div>
      <Field name="referred_by" label="Derivado por" values={v} help="Médico o institución que lo derivó." />
      <div className="mfl-field">
        <label className="mfl-field__label" htmlFor="alerts">Alertas y contraindicaciones</label>
        <textarea className="mfl-input" id="alerts" name="alerts" rows={2} defaultValue={v.alerts ?? ''} placeholder="Por ejemplo: marcapasos, no aplicar electroterapia" />
        <span className="mfl-field__help">Se muestran destacadas arriba de la ficha.</span>
      </div>
      <div className="form-actions">
        <button type="submit" className="mfl-btn mfl-btn--primary" disabled={pending}>
          {patient ? 'Guardar cambios' : 'Guardar paciente'}
        </button>
      </div>
    </form>
  );
}
