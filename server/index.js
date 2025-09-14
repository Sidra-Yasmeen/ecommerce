import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import db from './services/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIR = path.resolve(__dirname, '../client');


const app = express();
app.use(express.static(CLIENT_DIR));
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '/client/images')));

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 AS ok');
    res.json({ ok: !!rows.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(CLIENT_DIR, 'products.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`NovaMart server running on http://localhost:${PORT}`));
