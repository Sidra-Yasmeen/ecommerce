import { Router } from 'express';
import db from '../services/db.js';

const router = Router();

// naive sessionless cart for demo: single cart table
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.product_id, c.quantity, p.name, p.price
      FROM cart c
      JOIN products p ON p.id = c.product_id
      ORDER BY c.updated_at DESC
    `);
    res.json({ items: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  const { productId, quantity = 1 } = req.body || {};
  try {
    await db.query(`
      INSERT INTO cart (product_id, quantity) VALUES (?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), updated_at = CURRENT_TIMESTAMP
    `, [productId, quantity]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/', async (req, res) => {
  const { productId, delta = 1 } = req.body || {};
  try {
    await db.query(`
      UPDATE cart SET quantity = GREATEST(quantity + ?, 0), updated_at = CURRENT_TIMESTAMP
      WHERE product_id = ?
    `, [delta, productId]);
    // cleanup 0-qty rows
    await db.query(`DELETE FROM cart WHERE quantity <= 0`);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:productId', async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE product_id = ?', [req.params.productId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
