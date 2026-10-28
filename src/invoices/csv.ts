import { pool, type Invoice } from '../db.js';
import { countInvoices, PAGE_SIZE } from './list.js';

/** One CSV line: fields in double quotes where they need them, quotes doubled. */
export function csvLine(fields: (string | number)[]): string {
  return (
    fields
      .map((field) => {
        const text = String(field);
        return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
      })
      .join(',') + '\n'
  );
}

/** Cents as a plain decimal amount, such as 1234 → "12.34". */
export function amount(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** The invoices of one status, a page at a time, oldest first, so a large export never sits in memory. */
export async function* invoicePages(status: string): AsyncGenerator<Invoice[]> {
  const total = await countInvoices(status);
  const pages = Math.ceil(total / PAGE_SIZE);
  for (let page = 1; page < pages; page++) {
    const { rows } = await pool.query<Invoice>(
      'SELECT * FROM invoices WHERE status = $1 ORDER BY issued_on, id LIMIT $2 OFFSET $3',
      [status, PAGE_SIZE, (page - 1) * PAGE_SIZE],
    );
    yield rows;
  }
}
