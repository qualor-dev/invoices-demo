import pg from 'pg';

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export interface Invoice {
  id: number;
  number: string;
  customer: string;
  status: 'draft' | 'sent' | 'paid' | 'void';
  totalCents: number;
  issuedOn: string;
}
