# Backend Changes for Categories

## Database Schema Update

```sql
-- Add category column to tours table
ALTER TABLE tours ADD COLUMN category VARCHAR(50) DEFAULT 'Cultural';

-- Update existing tours with default category
UPDATE tours SET category = 'Cultural' WHERE category IS NULL;
```

## API Endpoints Updates

### GET /api/tours
Add category filtering:
```javascript
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = 'SELECT * FROM tours WHERE 1=1';
    const params = [];
    
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [tours] = await db.execute(query, params);
    res.json({ success: true, tours });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching tours' });
  }
});
```

### POST /api/tours
Include category validation:
```javascript
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
```

### GET /api/tours/categories
New endpoint for categories:
```javascript
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'Cultural', name: 'Cultural', count: 0 },
      { id: 'Histórico', name: 'Histórico', count: 0 },
      { id: 'Gastronómico', name: 'Gastronómico', count: 0 },
      { id: 'Aventura', name: 'Aventura', count: 0 },
      { id: 'Nocturno', name: 'Nocturno', count: 0 },
      { id: 'Familiar', name: 'Familiar', count: 0 },
      { id: 'Arquitectónico', name: 'Arquitectónico', count: 0 },
      { id: 'Religioso', name: 'Religioso', count: 0 }
    ];
    
    // Get counts for each category
    const [counts] = await db.execute(
      'SELECT category, COUNT(*) as count FROM tours GROUP BY category'
    );
    
    counts.forEach(item => {
      const category = categories.find(cat => cat.id === item.category);
      if (category) category.count = item.count;
    });
    
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
});
```