import express from 'express';
import { listInvoices } from './invoices/list.js';

const app = express();

app.get('/invoices', listInvoices);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`invoices API on :${port}`));
