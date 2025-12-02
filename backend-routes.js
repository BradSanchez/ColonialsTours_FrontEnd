// routes/tours.js - Actualizar endpoints existentes

const express = require('express');
const router = express.Router();

// Middleware de autenticación (asume que ya existe)
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token required' });
  }
  // Verificar token y agregar req.user
  next();
};

// GET /api/tours - Incluir is_saved field
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const userId = req.user?.id;
    
    let query = `
      SELECT t.*, 
             ${userId ? `CASE WHEN st.id IS NOT NULL THEN 1 ELSE 0 END as is_saved` : '0 as is_saved'}
      FROM tours t
      ${userId ? 'LEFT JOIN saved_tours st ON t.id = st.tour_id AND st.user_id = ?' : ''}
      WHERE 1=1
    `;
    
    const params = userId ? [userId] : [];
    
    if (category && category !== 'all') {
      query += ' AND t.category = ?';
      params.push(category);
    }
    
    if (search) {
      query += ' AND (t.title LIKE ? OR t.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY t.created_at DESC';
    
    const [tours] = await db.execute(query, params);
    
    // Parse JSON images field
    const formattedTours = tours.map(tour => ({
      ...tour,
      images: tour.images ? (typeof tour.images === 'string' ? JSON.parse(tour.images) : tour.images) : []
    }));
    
    res.json({ success: true, tours: formattedTours });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching tours' });
  }
});

// POST /api/tours/save
router.post('/save', requireAuth, async (req, res) => {
  try {
    const { tourId } = req.body;
    const userId = req.user.id;
    
    await db.execute(
      'INSERT IGNORE INTO saved_tours (user_id, tour_id) VALUES (?, ?)',
      [userId, tourId]
    );
    
    res.json({ success: true, message: 'Tour saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving tour' });
  }
});

// DELETE /api/tours/saved/:tourId
router.delete('/saved/:tourId', requireAuth, async (req, res) => {
  try {
    const { tourId } = req.params;
    const userId = req.user.id;
    
    await db.execute(
      'DELETE FROM saved_tours WHERE user_id = ? AND tour_id = ?',
      [userId, tourId]
    );
    
    res.json({ success: true, message: 'Tour removed from saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing saved tour' });
  }
});

// GET /api/tours/saved
router.get('/saved', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [savedTours] = await db.execute(`
      SELECT t.*, st.created_at as saved_at, 1 as is_saved
      FROM tours t
      INNER JOIN saved_tours st ON t.id = st.tour_id
      WHERE st.user_id = ?
      ORDER BY st.created_at DESC
    `, [userId]);
    
    // Parse JSON images field
    const formattedTours = savedTours.map(tour => ({
      ...tour,
      images: tour.images ? (typeof tour.images === 'string' ? JSON.parse(tour.images) : tour.images) : []
    }));
    
    res.json({ success: true, savedTours: formattedTours });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching saved tours' });
  }
});

// POST /api/tours - Incluir category en creación
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, price, duration, location, category, images } = req.body;
    
    // Validate category
    const validCategories = ['Cultural', 'Histórico', 'Gastronómico', 'Aventura', 'Nocturno', 'Familiar', 'Arquitectónico', 'Religioso'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }
    
    const [result] = await db.execute(
      'INSERT INTO tours (title, description, price, duration, location, category, guide_id, guide_name, image_url, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, price, duration, location, category, req.user.id, req.user.name, images?.[0] || null, JSON.stringify(images || [])]
    );
    
    res.json({ success: true, message: 'Tour created successfully', tourId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating tour' });
  }
});

// PUT /api/tours/:id - Incluir category en actualización
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, duration, location, category, images } = req.body;
    
    // Validate category
    const validCategories = ['Cultural', 'Histórico', 'Gastronómico', 'Aventura', 'Nocturno', 'Familiar', 'Arquitectónico', 'Religioso'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }
    
    await db.execute(
      'UPDATE tours SET title = ?, description = ?, price = ?, duration = ?, location = ?, category = ?, image_url = ?, images = ? WHERE id = ? AND guide_id = ?',
      [title, description, price, duration, location, category, images?.[0] || null, JSON.stringify(images || []), id, req.user.id]
    );
    
    res.json({ success: true, message: 'Tour updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating tour' });
  }
});

module.exports = router;