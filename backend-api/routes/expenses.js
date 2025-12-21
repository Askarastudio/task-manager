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
    
    // Convert snake_case to camelCase
    const expensesFormatted = expenses.map(e => ({
      id: e.id,
      projectId: e.project_id,
      description: e.description,
      amount: e.amount,
      category: e.category,
      date: e.date,
      createdAt: e.created_at
    }));
    
    res.json({ success: true, data: expensesFormatted });
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
    const { description, amount, category, date, projectId } = req.body;

    await db.query(
      'UPDATE expenses SET description = ?, amount = ?, category = ?, date = ? WHERE id = ?',
      [description, amount, category, date, id]
    );

    // Get existing data
    const [existing] = await db.query('SELECT project_id, created_at FROM expenses WHERE id = ?', [id]);
    const expenseProjectId = projectId || existing[0]?.project_id;
    const createdAt = existing[0]?.created_at || Date.now();

    res.json({ 
      success: true, 
      data: { id, projectId: expenseProjectId, description, amount, category, date, createdAt } 
    });
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
