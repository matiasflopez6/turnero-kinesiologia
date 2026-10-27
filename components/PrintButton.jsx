'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button type="button" className="mfl-btn mfl-btn--secondary" onClick={() => window.print()}>
      <Printer size={16} strokeWidth={1.5} />
      Imprimir o guardar PDF
    </button>
  );
}
