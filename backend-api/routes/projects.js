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
    
    // Convert snake_case to camelCase and map to frontend expected format
    const projectsFormatted = projects.map(p => ({
      projectId: p.id,
      name: p.name,
      description: p.description || '',
      budget: Number(p.value) || 0,
      status: p.status || 'pending',
      startDate: p.created_at || Date.now(),
      endDate: p.created_at ? p.created_at + (90 * 24 * 60 * 60 * 1000) : Date.now(),
      teamMembers: [],
      createdAt: p.created_at || Date.now()
    }));
    
    console.log('Projects API response:', projectsFormatted);
    
    res.json({ success: true, data: projectsFormatted });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, error: 'Gagal mengambil data proyek' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, budget, status } = req.body;
    const projectId = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = Date.now();
    const statusValue = status || 'pending';

    await db.query(
      'INSERT INTO projects (id, name, value, description, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [projectId, name, budget || 0, description || '', statusValue, createdAt]
    );

    res.json({ 
      success: true, 
      data: { 
        projectId, 
        name, 
        description: description || '',
        budget: Number(budget) || 0, 
        status: statusValue,
        startDate: createdAt,
        endDate: createdAt + (90 * 24 * 60 * 60 * 1000),
        teamMembers: [],
        createdAt 
      } 
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, error: 'Gagal membuat proyek' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, budget, status } = req.body;

    await db.query(
      'UPDATE projects SET name = ?, value = ?, description = ?, status = ? WHERE id = ?',
      [name, budget || 0, description || '', status || 'pending', id]
    );

    // Get createdAt from existing record
    const [existing] = await db.query('SELECT created_at FROM projects WHERE id = ?', [id]);
    const createdAt = existing[0]?.created_at || Date.now();

    res.json({ 
      success: true, 
      data: { 
        projectId: id, 
        name, 
        description: description || '',
        budget: Number(budget) || 0,
        status: status || 'pending',
        startDate: createdAt,
        endDate: createdAt + (90 * 24 * 60 * 60 * 1000),
        teamMembers: [],
        createdAt 
      } 
    });
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
