# Backend Changes for Saved Tours

## Database Schema

```sql
-- Create saved_tours table
CREATE TABLE saved_tours (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  tour_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_tour (user_id, tour_id)
);
```

## API Endpoints

### GET /api/tours
Update to include is_saved field:
```javascript
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    let query = `
      SELECT t.*, 
             ${userId ? `CASE WHEN st.id IS NOT NULL THEN 1 ELSE 0 END as is_saved` : '0 as is_saved'}
      FROM tours t
      ${userId ? 'LEFT JOIN saved_tours st ON t.id = st.tour_id AND st.user_id = ?' : ''}
      ORDER BY t.created_at DESC
    `;
    
    const params = userId ? [userId] : [];
    const [tours] = await db.execute(query, params);
    
    res.json({ success: true, tours });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching tours' });
  }
});
```

### POST /api/tours/save
```javascript
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
```

### DELETE /api/tours/saved/:tourId
```javascript
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
```

### GET /api/tours/saved
```javascript
router.get('/saved', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [savedTours] = await db.execute(`
      SELECT t.*, st.created_at as saved_at
      FROM tours t
      INNER JOIN saved_tours st ON t.id = st.tour_id
      WHERE st.user_id = ?
      ORDER BY st.created_at DESC
    `, [userId]);
    
    res.json({ success: true, savedTours });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching saved tours' });
  }
});
```