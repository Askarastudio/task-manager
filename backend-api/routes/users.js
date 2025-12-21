const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, error: 'Gagal mengambil data user' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = Date.now();

    await db.query(
      'INSERT INTO users (id, name, email, role, password, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, email, role, hashedPassword, createdAt]
    );

    res.json({ 
      success: true, 
      data: { id, name, email, role, createdAt } 
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, error: 'Gagal membuat user' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    
    let query = 'UPDATE users SET name = ?, email = ?, role = ?';
    let params = [name, email, role];
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }
    
    query += ' WHERE id = ?';
    params.push(id);

    await db.query(query, params);

    res.json({ success: true, data: { id, name, email, role } });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, error: 'Gagal update user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, error: 'Gagal menghapus user' });
  }
});

module.exports = router;
