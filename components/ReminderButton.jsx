'use client';

import { MessageCircle } from 'lucide-react';
import { markReminded } from '@/app/(app)/agenda/actions';

// Abre WhatsApp con el mensaje armado y deja registrado que se envió el recordatorio.
export default function ReminderButton({ href, appointmentId, small = false }) {
  if (!href) return <span className="body-s muted">Sin celular para WhatsApp</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`mfl-btn mfl-btn--secondary ${small ? 'mfl-btn--sm' : ''}`}
      onClick={() => markReminded(appointmentId)}
    >
      <MessageCircle size={16} strokeWidth={1.5} />
      Enviar recordatorio
    </a>
  );
}
