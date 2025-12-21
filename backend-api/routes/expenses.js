const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const { projectId } = req.query;
    let query = 'SELECT * FROM expenses';
    let params = [];

    if (projectId) {
      query += ' WHERE project_id = ?';
      params.push(projectId);
    }

    query += ' ORDER BY date DESC';

    const [expenses] = await db.query(query, params);
    res.json({ success: true, data: expenses });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ success: false, error: 'Gagal mengambil data pengeluaran' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { projectId, description, amount, category, date } = req.body;
    const id = `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = Date.now();

    await db.query(
      'INSERT INTO expenses (id, project_id, description, amount, category, date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, projectId, description, amount, category, date, createdAt]
    );

    res.json({ 
      success: true, 
      data: { id, projectId, description, amount, category, date, createdAt } 
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ success: false, error: 'Gagal membuat pengeluaran' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, category, date } = req.body;

    await db.query(
      'UPDATE expenses SET description = ?, amount = ?, category = ?, date = ? WHERE id = ?',
      [description, amount, category, date, id]
    );

    res.json({ success: true, data: { id, description, amount, category, date } });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ success: false, error: 'Gagal update pengeluaran' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM expenses WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ success: false, error: 'Gagal menghapus pengeluaran' });
  }
});

module.exports = router;
