import express from 'express';
import { exportInvoices } from './invoices/export.js';
import { listInvoices } from './invoices/list.js';

const app = express();

app.get('/invoices', listInvoices);
app.get('/invoices/export', exportInvoices);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`invoices API on :${port}`));
