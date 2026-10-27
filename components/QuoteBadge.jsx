import { QUOTE_STATUS } from '@/lib/money';

export default function QuoteBadge({ status }) {
  const s = QUOTE_STATUS[status] ?? QUOTE_STATUS.pendiente;
  return <span className={`mfl-badge mfl-badge--${s.badge}`}>{s.label}</span>;
}
