const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const [projects] = await db.query(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );
    
    // Convert snake_case to camelCase
    const projectsFormatted = projects.map(p => ({
      id: p.id,
      name: p.name,
      customer: p.customer,
      value: p.value,
      description: p.description,
      createdAt: p.created_at
    }));
    
    res.json({ success: true, data: projectsFormatted });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, error: 'Gagal mengambil data proyek' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, customer, value, description } = req.body;
    const id = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = Date.now();

    await db.query(
      'INSERT INTO projects (id, name, customer, value, description, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, customer, value, description, createdAt]
    );

    res.json({ 
      success: true, 
      data: { id, name, customer, value, description, createdAt } 
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, error: 'Gagal membuat proyek' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, customer, value, description } = req.body;

    await db.query(
      'UPDATE projects SET name = ?, customer = ?, value = ?, description = ? WHERE id = ?',
      [name, customer, value, description, id]
    );

    // Get createdAt from existing record
    const [existing] = await db.query('SELECT created_at FROM projects WHERE id = ?', [id]);
    const createdAt = existing[0]?.created_at || Date.now();

    res.json({ success: true, data: { id, name, customer, value, description, createdAt } });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, error: 'Gagal update proyek' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM tasks WHERE project_id = ?', [id]);
    await db.query('DELETE FROM expenses WHERE project_id = ?', [id]);
    await db.query('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, error: 'Gagal menghapus proyek' });
  }
});

module.exports = router;
