const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const { projectId } = req.query;
    let query = 'SELECT * FROM tasks';
    let params = [];

    if (projectId) {
      query += ' WHERE project_id = ?';
      params.push(projectId);
    }

    query += ' ORDER BY created_at DESC';

    const [tasks] = await db.query(query, params);
    
    const tasksWithParsedUsers = tasks.map(task => ({
      ...task,
      assignedUserIds: JSON.parse(task.assigned_user_ids || '[]'),
      completed: !!task.completed
    }));

    res.json({ success: true, data: tasksWithParsedUsers });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, error: 'Gagal mengambil data task' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { projectId, title, description, assignedUserIds } = req.body;
    const id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = Date.now();

    await db.query(
      'INSERT INTO tasks (id, project_id, title, description, assigned_user_ids, completed, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, projectId, title, description, JSON.stringify(assignedUserIds), false, createdAt]
    );

    res.json({ 
      success: true, 
      data: { id, projectId, title, description, assignedUserIds, completed: false, createdAt } 
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ success: false, error: 'Gagal membuat task' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assignedUserIds, completed } = req.body;

    await db.query(
      'UPDATE tasks SET title = ?, description = ?, assigned_user_ids = ?, completed = ? WHERE id = ?',
      [title, description, JSON.stringify(assignedUserIds), completed, id]
    );

    res.json({ success: true, data: { id, title, description, assignedUserIds, completed } });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ success: false, error: 'Gagal update task' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ success: false, error: 'Gagal menghapus task' });
  }
});

module.exports = router;
