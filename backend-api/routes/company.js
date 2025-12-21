const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/settings', async (req, res) => {
  try {
    const [settings] = await db.query('SELECT * FROM company_settings WHERE id = 1');
    
    if (settings.length === 0) {
      return res.json({ 
        success: true, 
        data: {
          name: 'IkuHub Proyeksi',
          address: '',
          phone: '',
          email: ''
        }
      });
    }

    res.json({ success: true, data: settings[0] });
  } catch (error) {
    console.error('Get company settings error:', error);
    res.status(500).json({ success: false, error: 'Gagal mengambil pengaturan perusahaan' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const { name, logo, address, phone, email, letterhead } = req.body;

    const [existing] = await db.query('SELECT id FROM company_settings WHERE id = 1');

    if (existing.length === 0) {
      await db.query(
        'INSERT INTO company_settings (id, name, logo, address, phone, email, letterhead) VALUES (1, ?, ?, ?, ?, ?, ?)',
        [name, logo, address, phone, email, letterhead]
      );
    } else {
      await db.query(
        'UPDATE company_settings SET name = ?, logo = ?, address = ?, phone = ?, email = ?, letterhead = ? WHERE id = 1',
        [name, logo, address, phone, email, letterhead]
      );
    }

    res.json({ success: true, data: { name, logo, address, phone, email, letterhead } });
  } catch (error) {
    console.error('Update company settings error:', error);
    res.status(500).json({ success: false, error: 'Gagal update pengaturan perusahaan' });
  }
});

module.exports = router;
