'use client';

import { useActionState } from 'react';
import EvaPicker from './EvaPicker';
import { ZONES } from '@/lib/body';
import { saveNote } from '@/app/(app)/pacientes/clinical-actions';

export default function NoteForm({ patientId, professionals, today, hasNotes }) {
  const [state, action, pending] = useActionState(saveNote, null);
  const v = state?.values ?? {};

  return (
    <form action={action} className="form" key={state?.key}>
      {state?.error && <p className="form-error" role="alert">{state.error}</p>}
      {state?.ok && <p className="form-ok" role="status">{state.ok}</p>}
      <input type="hidden" name="patient_id" value={patientId} />
      <div className="form-row">
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="note_date">Fecha</label>
          <input className="mfl-input" type="date" id="note_date" name="note_date" defaultValue={v.note_date ?? today} required />
        </div>
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="kind">Tipo</label>
          <select className="mfl-input" id="kind" name="kind" defaultValue={v.kind ?? (hasNotes ? 'sesion' : 'evaluacion')}>
            <option value="evaluacion">Evaluación inicial</option>
            <option value="sesion">Sesión</option>
          </select>
        </div>
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="professional_id">Kinesiólogo</label>
          <select className="mfl-input" id="professional_id" name="professional_id" defaultValue={v.professional_id ?? (professionals.length === 1 ? professionals[0].id : '')}>
            <option value="">Sin indicar</option>
            {professionals.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="zone">Zona</label>
          <select className="mfl-input" id="zone" name="zone" defaultValue={v.zone ?? ''}>
            <option value="">Sin indicar</option>
            {Object.entries(ZONES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>
      </div>
      <div className="mfl-field">
        <span className="mfl-field__label">Dolor al final de la sesión (EVA)</span>
        <EvaPicker defaultValue={v.eva} />
      </div>
      <div className="mfl-field">
        <label className="mfl-field__label" htmlFor="body">Qué se hizo y cómo respondió</label>
        <textarea className="mfl-input" id="body" name="body" rows={4} defaultValue={v.body ?? ''} required />
      </div>
      <div className="form-actions">
        <button type="submit" className="mfl-btn mfl-btn--primary" disabled={pending}>Guardar sesión</button>
      </div>
    </form>
  );
}
