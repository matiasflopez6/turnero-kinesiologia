'use client';

import { useEffect, useState } from 'react';
import { getBusy } from '@/app/(app)/agenda/actions';
import { DAY_END, DAY_START, SLOT_STEP, timeOf } from '@/lib/agenda';

// Grilla de horarios del día: libre, seleccionado u ocupado según los turnos del kinesiólogo.
export default function SlotPicker({ professionalId, date, duration, value, onChange, excludeId }) {
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    let alive = true;
    setBusy(null);
    if (!professionalId || !date) return;
    getBusy(professionalId, date, excludeId).then((b) => alive && setBusy(b));
    return () => {
      alive = false;
    };
  }, [professionalId, date, excludeId]);

  if (!professionalId || !date) return <p className="body-s muted">Elegí el kinesiólogo y la fecha para ver los horarios.</p>;
  if (!busy) return <p className="body-s muted">Buscando horarios libres</p>;

  const slots = [];
  for (let m = DAY_START; m + duration <= DAY_END; m += SLOT_STEP) {
    const taken = busy.some(([s, e]) => m < e && m + duration > s);
    slots.push({ time: timeOf(m), taken });
  }
  const free = slots.filter((s) => !s.taken).length;

  return (
    <div className="slots-block">
      {free === 0 && <p className="body-s muted">No quedan horarios libres para esa duración. Probá otro día.</p>}
      <div className="mfl-slots" role="group" aria-label="Horarios">
        {slots.map((s) => (
          <button
            key={s.time}
            type="button"
            className="mfl-slot"
            disabled={s.taken}
            aria-pressed={value === s.time}
            onClick={() => onChange(s.time)}
          >
            {s.time}
          </button>
        ))}
      </div>
    </div>
  );
}
