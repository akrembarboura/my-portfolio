/** Export an array of records to a downloadable CSV file. */
export function exportToCsv<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  columns?: { key: keyof T; label: string }[]
): void {
  if (rows.length === 0) return;

  const cols =
    columns ??
    (Object.keys(rows[0]).map((k) => ({ key: k as keyof T, label: k })) as {
      key: keyof T;
      label: string;
    }[]);

  const escape = (value: unknown): string => {
    const str = value === null || value === undefined ? '' : String(value);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = cols.map((c) => escape(c.label)).join(',');
  const body = rows
    .map((row) => cols.map((c) => escape(row[c.key])).join(','))
    .join('\n');

  const csv = `\uFEFF${header}\n${body}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
