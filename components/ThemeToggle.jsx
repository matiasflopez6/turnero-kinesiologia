'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dia');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'noche' ? 'noche' : 'dia');
  }, []);

  function toggle() {
    const next = theme === 'noche' ? 'dia' : 'noche';
    if (next === 'noche') document.documentElement.dataset.theme = 'noche';
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem('tema', next);
    } catch {
      // Sin almacenamiento: el cambio vale solo para esta visita.
    }
    setTheme(next);
  }

  const label = theme === 'noche' ? 'Usar tema claro' : 'Usar tema oscuro';
  return (
    <button type="button" className="icon-btn" onClick={toggle} title={label} aria-label={label}>
      {theme === 'noche' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
    </button>
  );
}
