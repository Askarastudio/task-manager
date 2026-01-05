const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get comprehensive report data
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Calculate date threshold based on period
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    let dateThreshold = 0;
    
    switch (period) {
      case 'month':
        dateThreshold = now - (30 * day);
        break;
      case 'quarter':
        dateThreshold = now - (90 * day);
        break;
      case 'year':
        dateThreshold = now - (365 * day);
        break;
      default:
        dateThreshold = 0;
    }

    // Get all data within the period
    const projects = db.prepare(`
      SELECT * FROM projects 
      WHERE createdAt >= ?
      ORDER BY createdAt DESC
    `).all(dateThreshold);

    const tasks = db.prepare(`
      SELECT * FROM tasks 
      WHERE createdAt >= ?
      ORDER BY createdAt DESC
    `).all(dateThreshold);

    const expenses = db.prepare(`
      SELECT * FROM expenses 
      WHERE date >= ?
      ORDER BY date DESC
    `).all(dateThreshold);

    const users = db.prepare('SELECT userId, name, email, role FROM users').all();

    // Calculate statistics
    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'in-progress').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      pendingProjects: projects.filter(p => p.status === 'pending').length,
      onholdProjects: projects.filter(p => p.status === 'onhold').length,
      
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed === 1).length,
      pendingTasks: tasks.filter(t => t.completed === 0).length,
      
      totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
      totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
      
      period,
      generatedAt: now
    };

    // Project progress calculation
    const projectsWithProgress = projects.map(project => {
      const projectTasks = tasks.filter(t => t.projectId === project.projectId);
      const completedTasks = projectTasks.filter(t => t.completed === 1).length;
      const progress = projectTasks.length > 0 
        ? Math.round((completedTasks / projectTasks.length) * 100)
        : 0;
      
      return {
        ...project,
        progress,
        totalTasks: projectTasks.length,
        completedTasks
      };
    });

    // Expenses by project
    const expensesByProject = {};
    expenses.forEach(expense => {
      if (!expensesByProject[expense.projectId]) {
        expensesByProject[expense.projectId] = 0;
      }
      expensesByProject[expense.projectId] += expense.amount;
    });

    // Tasks by user
    const tasksByUser = {};
    tasks.forEach(task => {
      if (!task.assignedTo) return;
      
      if (!tasksByUser[task.assignedTo]) {
        tasksByUser[task.assignedTo] = {
          total: 0,
          completed: 0
        };
      }
      
      tasksByUser[task.assignedTo].total++;
      if (task.completed === 1) {
        tasksByUser[task.assignedTo].completed++;
      }
    });

    res.json({
      success: true,
      data: {
        stats,
        projects: projectsWithProgress,
        tasks,
        expenses,
        users,
        expensesByProject,
        tasksByUser
      }
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate report'
    });
  }
});

// Get project-specific report
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = db.prepare('SELECT * FROM projects WHERE projectId = ?').get(projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const tasks = db.prepare(`
      SELECT * FROM tasks 
      WHERE projectId = ?
      ORDER BY createdAt DESC
    `).all(projectId);

    const expenses = db.prepare(`
      SELECT * FROM expenses 
      WHERE projectId = ?
      ORDER BY date DESC
    `).all(projectId);

    const completedTasks = tasks.filter(t => t.completed === 1).length;
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const budgetUtilization = project.budget > 0 
      ? (totalExpenses / project.budget) * 100 
      : 0;

    res.json({
      success: true,
      data: {
        project,
        tasks,
        expenses,
        stats: {
          totalTasks: tasks.length,
          completedTasks,
          pendingTasks: tasks.length - completedTasks,
          totalExpenses,
          budget: project.budget || 0,
          budgetUtilization,
          progress: tasks.length > 0 
            ? Math.round((completedTasks / tasks.length) * 100)
            : 0
        }
      }
    });
  } catch (error) {
    console.error('Error generating project report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate project report'
    });
  }
});

// Export report as CSV
router.get('/export', authenticateToken, async (req, res) => {
  try {
    const { type = 'overview', period = 'month' } = req.query;
    
    // Calculate date threshold
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    let dateThreshold = 0;
    
    switch (period) {
      case 'month':
        dateThreshold = now - (30 * day);
        break;
      case 'quarter':
        dateThreshold = now - (90 * day);
        break;
      case 'year':
        dateThreshold = now - (365 * day);
        break;
    }

    let csv = '';
    
    if (type === 'projects') {
      const projects = db.prepare(`
        SELECT * FROM projects 
        WHERE createdAt >= ?
        ORDER BY createdAt DESC
      `).all(dateThreshold);
      
      csv = 'Project ID,Name,Status,Budget,Created At\n';
      projects.forEach(p => {
        csv += `${p.projectId},"${p.name}","${p.status}",${p.budget || 0},${new Date(p.createdAt).toISOString()}\n`;
      });
    } else if (type === 'tasks') {
      const tasks = db.prepare(`
        SELECT * FROM tasks 
        WHERE createdAt >= ?
        ORDER BY createdAt DESC
      `).all(dateThreshold);
      
      csv = 'Task ID,Title,Project ID,Assigned To,Completed,Created At\n';
      tasks.forEach(t => {
        csv += `${t.taskId},"${t.title}",${t.projectId},${t.assignedTo || ''},${t.completed ? 'Yes' : 'No'},${new Date(t.createdAt).toISOString()}\n`;
      });
    } else if (type === 'expenses') {
      const expenses = db.prepare(`
        SELECT * FROM expenses 
        WHERE date >= ?
        ORDER BY date DESC
      `).all(dateThreshold);
      
      csv = 'Expense ID,Description,Project ID,Amount,Date\n';
      expenses.forEach(e => {
        csv += `${e.expenseId},"${e.description}",${e.projectId},${e.amount},${new Date(e.date).toISOString()}\n`;
      });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=report_${type}_${period}_${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export report'
    });
  }
});

module.exports = router;
