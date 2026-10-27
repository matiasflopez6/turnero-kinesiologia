'use client';

import { useActionState, useState } from 'react';
import { FINDINGS, SILHOUETTE, VIEWS, ZONES, severity } from '@/lib/body';
import { saveFinding } from '@/app/(app)/pacientes/clinical-actions';
import EvaPicker from './EvaPicker';

function Figure({ view, label, byZone, selected, onSelect }) {
  return (
    <figure className="body-fig">
      <svg viewBox="0 0 200 400" role="group" aria-label={`Vista de ${label}`}>
        {SILHOUETTE.map(([x, y, w, h], i) => <rect key={i} className="body-sil" x={x} y={y} width={w} height={h} />)}
        {VIEWS[view].map(([zone, x, y, w, h]) => {
          const items = byZone[zone] ?? [];
          const top = items.reduce((max, f) => (f.eva != null && (max == null || f.eva > max) ? f.eva : max), null);
          const level = items.length ? severity(top) : 'libre';
          return (
            <g
              key={zone}
              className={`body-zone body-zone--${level} ${selected === zone ? 'is-selected' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`${ZONES[zone]}${top != null ? `, EVA ${top}` : items.length ? ', marcada' : ''}`}
              onClick={() => onSelect(zone)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(zone))}
            >
              <rect x={x} y={y} width={w} height={h} />
              {top != null && <text x={x + w / 2} y={y + h / 2}>{top}</text>}
            </g>
          );
        })}
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

export default function BodyMap({ patientId, findings }) {
  const [selected, setSelected] = useState(null);
  const [state, action, pending] = useActionState(saveFinding, null);

  const byZone = {};
  for (const f of findings) (byZone[f.zone] ??= []).push(f);


  return (
    <div className="body-map">
      <div className="body-figs">
        <Figure view="frente" label="Frente" byZone={byZone} selected={selected} onSelect={setSelected} />
        <Figure view="espalda" label="Espalda" byZone={byZone} selected={selected} onSelect={setSelected} />
      </div>

      <div className="body-panel mfl-card">
        {!selected ? (
          <p className="mfl-card__body">Tocá una zona del cuerpo para marcar dolor, contractura o limitación de movilidad.</p>
        ) : (
          <form action={action} className="form" key={selected}>
            <h3 className="mfl-card__title">{ZONES[selected]}</h3>
            {state?.zone === selected && state?.error && <p className="form-error" role="alert">{state.error}</p>}
            {state?.zone === selected && state?.ok && <p className="form-ok" role="status">{state.ok}</p>}
            <input type="hidden" name="patient_id" value={patientId} />
            <input type="hidden" name="zone" value={selected} />
            <fieldset className="choice">
              <legend className="mfl-field__label">Hallazgo</legend>
              {Object.entries(FINDINGS).map(([key, label], i) => (
                <label key={key} className="check">
                  <input type="radio" name="finding" value={key} defaultChecked={i === 0} />
                  {label}
                </label>
              ))}
            </fieldset>
            <div className="mfl-field">
              <span className="mfl-field__label">Intensidad (EVA)</span>
              <EvaPicker />
              <span className="mfl-field__help">0 es sin dolor y 10 el peor dolor imaginable. Dejalo vacío si no aplica.</span>
            </div>
            <div className="mfl-field">
              <label className="mfl-field__label" htmlFor="finding-notes">Notas</label>
              <input className="mfl-input" id="finding-notes" name="notes" />
            </div>
            <div className="form-actions">
              <button type="submit" className="mfl-btn mfl-btn--primary" disabled={pending}>Guardar hallazgo</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
