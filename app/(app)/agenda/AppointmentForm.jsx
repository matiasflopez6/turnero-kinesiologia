'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import FormError from '@/components/forms/FormError';
import SlotPicker from '@/components/SlotPicker';
import { DURATIONS } from '@/lib/agenda';
import { saveAppointment } from './actions';

export default function AppointmentForm({ appointment, initial, patients, professionals }) {
  const [state, action, pending] = useActionState(saveAppointment, null);
  const v = state?.values ?? appointment ?? initial;
  const [professionalId, setProfessionalId] = useState(String(v.professional_id ?? ''));
  const [date, setDate] = useState(v.date ?? '');
  const [duration, setDuration] = useState(Number(v.duration) || 45);
  const [time, setTime] = useState(v.time ?? '');

  return (
    <form action={action} className="form">
      <FormError state={state} />
      {appointment && <input type="hidden" name="id" value={appointment.id} />}
      <input type="hidden" name="time" value={time} />

      <div className="mfl-field">
        <label className="mfl-field__label" htmlFor="patient_id">Paciente</label>
        <select className="mfl-input" id="patient_id" name="patient_id" defaultValue={v.patient_id ?? ''} required>
          <option value="" disabled>Elegí un paciente</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.last_name}, {p.first_name}{p.dni ? ` (DNI ${p.dni})` : ''}</option>
          ))}
        </select>
        <span className="mfl-field__help">¿No está en la lista? <Link href="/pacientes/nuevo">Cargá un paciente nuevo</Link>.</span>
      </div>

      <div className="form-row">
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="professional_id">Kinesiólogo</label>
          <select
            className="mfl-input" id="professional_id" name="professional_id" required
            value={professionalId}
            onChange={(e) => { setProfessionalId(e.target.value); setTime(''); }}
          >
            <option value="" disabled>Elegí un kinesiólogo</option>
            {professionals.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="date">Fecha</label>
          <input
            className="mfl-input" id="date" name="date" type="date" required
            value={date} onChange={(e) => { setDate(e.target.value); setTime(''); }}
          />
        </div>
        <div className="mfl-field">
          <label className="mfl-field__label" htmlFor="duration">Duración</label>
          <select
            className="mfl-input" id="duration" name="duration"
            value={duration} onChange={(e) => { setDuration(Number(e.target.value)); setTime(''); }}
          >
            {DURATIONS.map((d) => <option key={d} value={d}>{d} minutos</option>)}
          </select>
        </div>
      </div>

      <div className="mfl-field">
        <span className="mfl-field__label">Horario</span>
        <SlotPicker
          professionalId={professionalId} date={date} duration={duration}
          value={time} onChange={setTime} excludeId={appointment?.id}
        />
      </div>

      <div className="mfl-field">
        <label className="mfl-field__label" htmlFor="notes">Notas</label>
        <textarea className="mfl-input" id="notes" name="notes" rows={2} defaultValue={v.notes ?? ''} />
      </div>

      <div className="form-actions">
        <button type="submit" className="mfl-btn mfl-btn--primary" disabled={pending || !time}>
          {appointment ? 'Guardar turno' : 'Agendar turno'}
        </button>
        {!time && <span className="body-s muted">Elegí un horario para continuar.</span>}
      </div>
    </form>
  );
}
