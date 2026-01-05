const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    console.log('=== GET /tasks called ===');
    const { projectId } = req.query;
    let query = 'SELECT * FROM tasks';
    let params = [];

    if (projectId) {
      query += ' WHERE project_id = ?';
      params.push(projectId);
    }

    query += ' ORDER BY created_at DESC';

    console.log('Query:', query);
    console.log('Params:', params);

    const [tasks] = await db.query(query, params);
    
    console.log('Tasks from DB:', tasks.length);
    
    // Convert snake_case to camelCase for frontend
    const tasksWithParsedUsers = tasks.map(task => {
      console.log('Processing task:', task.id);
      return {
        id: task.id,
        projectId: task.project_id,
        title: task.title,
        description: task.description,
        assignedUserIds: JSON.parse(task.assigned_user_ids || '[]'),
        completed: !!task.completed,
        createdAt: task.created_at
      };
    });

    console.log('Returning tasks:', tasksWithParsedUsers.length);
    res.json({ success: true, data: tasksWithParsedUsers });
  } catch (error) {
    console.error('=== GET /tasks ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ success: false, error: 'Gagal mengambil data task', details: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('=== POST /tasks called ===');
    const { projectId, title, description, assignedUserIds } = req.body;
    const id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = Date.now();

    console.log('Creating task:', { id, projectId, title });

    await db.query(
      'INSERT INTO tasks (id, project_id, title, description, assigned_user_ids, completed, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, projectId, title, description, JSON.stringify(assignedUserIds || []), false, createdAt]
    );

    const newTask = {
      id, 
      projectId, 
      title, 
      description, 
      assignedUserIds: assignedUserIds || [], 
      completed: false, 
      createdAt
    };

    console.log('Task created:', newTask);
    res.json({ success: true, data: newTask });
  } catch (error) {
    console.error('=== POST /tasks ERROR ===');
    console.error('Error details:', error);
    res.status(500).json({ success: false, error: 'Gagal membuat task', details: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    console.log('=== PUT /tasks/:id called ===');
    const { id } = req.params;
    const { title, description, assignedUserIds, completed, projectId } = req.body;

    console.log('Updating task:', id, { completed });

    await db.query(
      'UPDATE tasks SET title = ?, description = ?, assigned_user_ids = ?, completed = ? WHERE id = ?',
      [title, description, JSON.stringify(assignedUserIds || []), completed ? 1 : 0, id]
    );

    // Return data in camelCase format
    const updatedTask = {
      id,
      projectId: projectId,
      title,
      description,
      assignedUserIds: assignedUserIds || [],
      completed: !!completed,
      createdAt: Date.now() // Should get from DB ideally
    };

    console.log('Task updated:', updatedTask);
    res.json({ success: true, data: updatedTask });
  } catch (error) {
    console.error('=== PUT /tasks/:id ERROR ===');
    console.error('Error details:', error);
    res.status(500).json({ success: false, error: 'Gagal update task', details: error.message });
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
