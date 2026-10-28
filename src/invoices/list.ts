import type { Request, Response } from 'express';
import { pool, type Invoice } from '../db.js';

export const PAGE_SIZE = 50;

/** One page of invoices, newest first. */
export async function listInvoices(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, Number(req.query.page) || 1);
  const { rows } = await pool.query<Invoice>(
    'SELECT * FROM invoices ORDER BY issued_on DESC, id DESC LIMIT $1 OFFSET $2',
    [PAGE_SIZE, (page - 1) * PAGE_SIZE],
  );
  res.json(rows);
}

/** How many invoices there are, for the pager. */
export async function countInvoices(status?: string): Promise<number> {
  const { rows } = status
    ? await pool.query<{ n: string }>('SELECT count(*) AS n FROM invoices WHERE status = $1', [status])
    : await pool.query<{ n: string }>('SELECT count(*) AS n FROM invoices');
  return Number(rows[0]?.n ?? 0);
}
