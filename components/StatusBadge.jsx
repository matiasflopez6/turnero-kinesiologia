import { STATUS } from '@/lib/agenda';

export default function StatusBadge({ status }) {
  const s = STATUS[status] ?? STATUS.sin_confirmar;
  return <span className={`mfl-badge mfl-badge--${s.badge}`}>{s.label}</span>;
}
