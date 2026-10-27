'use client';

import { useState } from 'react';

const EVAS = Array.from({ length: 11 }, (_, i) => i);

// Escala de dolor de 0 a 10. Tocar el valor elegido lo borra.
export default function EvaPicker({ name = 'eva', defaultValue = '' }) {
  const [eva, setEva] = useState(String(defaultValue ?? ''));
  return (
    <>
      <input type="hidden" name={name} value={eva} />
      <div className="eva-scale" role="group" aria-label="EVA de 0 a 10">
        {EVAS.map((n) => (
          <button key={n} type="button" className="mfl-slot" aria-pressed={eva === String(n)} onClick={() => setEva(eva === String(n) ? '' : String(n))}>
            {n}
          </button>
        ))}
      </div>
    </>
  );
}
