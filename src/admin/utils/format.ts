/** Formatting helpers for the admin UI. */

export function formatDate(input: string | number | Date): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(input: string | number | Date): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function relativeTime(input: string | number | Date): string {
  const d = new Date(input).getTime();
  if (Number.isNaN(d)) return '—';
  const diff = Date.now() - d;
  const sec = Math.round(diff / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  if (sec < 60) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  if (hr < 24) return `il y a ${hr} h`;
  if (day < 30) return `il y a ${day} j`;
  return formatDate(input);
}

export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n);
}

export function truncate(text: string, length = 60): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}
