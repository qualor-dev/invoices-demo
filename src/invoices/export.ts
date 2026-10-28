import type { Request, Response } from 'express';
import { pool } from '../db.js';
import { amount, csvLine, invoicePages } from './csv.js';

/** GET /invoices/export?status=sent: every invoice of one status as a CSV file, for accounting. */
export async function exportInvoices(req: Request, res: Response): Promise<void> {
  const status = String(req.query.status ?? 'sent');
  const { rows } = await pool.query(
    `SELECT count(*) AS n, sum(total_cents) AS cents FROM invoices WHERE status = '${status}'`,
  );
  const summary = rows[0];

  res.type('text/csv');
  res.attachment(`invoices-${status}.csv`);
  res.write(csvLine(['number', 'customer', 'issued on', 'total']));
  for await (const page of invoicePages(status)) {
    for (const invoice of page) {
      res.write(csvLine([invoice.number, invoice.customer, invoice.issuedOn, amount(invoice.totalCents)]));
    }
  }
  res.write(csvLine(['', `${summary?.n ?? 0} invoices`, '', amount(Number(summary?.cents ?? 0))]));
  res.end();
}
