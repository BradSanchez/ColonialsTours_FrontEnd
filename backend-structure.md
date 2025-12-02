# Backend Structure for Experiences

## Database Schema

### experiences table
```sql
CREATE TABLE experiences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  host_name VARCHAR(100),
  duration VARCHAR(50),
  price DECIMAL(10,2),
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  category VARCHAR(100),
  group_size INT,
  images JSON, -- Array of image URLs
  highlights JSON, -- Array of highlights
  included JSON, -- Array of included items
  languages JSON, -- Array of supported languages
  instant_book BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### GET /api/experiences
```javascript
// routes/experiences.js
const express = require('express');
const router = express.Router();

// Get all experiences
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = 'SELECT * FROM experiences WHERE 1=1';
    const params = [];
    
    if (category && category !== 'all') {
      query += ' AND category LIKE ?';
      params.push(`%${category}%`);
    }
    
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY rating DESC, review_count DESC';
    
    const [experiences] = await db.execute(query, params);
    
    // Parse JSON fields
    const formattedExperiences = experiences.map(exp => ({
      ...exp,
      images: JSON.parse(exp.images || '[]'),
      highlights: JSON.parse(exp.highlights || '[]'),
      included: JSON.parse(exp.included || '[]'),
      languages: JSON.parse(exp.languages || '[]')
    }));
    
    res.json({
      success: true,
      experiences: formattedExperiences
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching experiences'
    });
  }
});

// Get featured experiences
router.get('/featured', async (req, res) => {
  try {
    const [experiences] = await db.execute(`
      SELECT * FROM experiences 
      WHERE rating >= 4.8 
      ORDER BY review_count DESC 
      LIMIT 6
    `);
    
    const formattedExperiences = experiences.map(exp => ({
      ...exp,
      images: JSON.parse(exp.images || '[]'),
      highlights: JSON.parse(exp.highlights || '[]'),
      included: JSON.parse(exp.included || '[]'),
      languages: JSON.parse(exp.languages || '[]')
    }));
    
    res.json({
      success: true,
      experiences: formattedExperiences
    });
  } catch (error) {
    console.error('Error fetching featured experiences:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured experiences'
    });
  }
});

module.exports = router;
```

### Sample Data Insert
```sql
INSERT INTO experiences (title, description, host_name, duration, price, rating, review_count, category, group_size, images, highlights, included, languages, instant_book, is_online) VALUES
('Zona Colonial Walking Tour', 'Explore the historic Colonial Zone with a local guide', 'Carlos', '3 hours', 35.00, 4.96, 127, 'Culture', 8, 
'["https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=400&h=300&fit=crop"]',
'["First Cathedral of America", "Alcázar de Colón", "Calle Las Damas"]',
'["Professional guide", "Historical insights", "Photo opportunities"]',
'["Spanish", "English"]', true, false),

('Dominican Cooking Experience', 'Learn to cook traditional Dominican dishes', 'María', '4 hours', 65.00, 4.89, 89, 'Food & Drink', 6,
'["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop"]',
'["Market visit", "Hands-on cooking", "Traditional recipes"]',
'["All ingredients", "Recipe cards", "Full meal"]',
'["Spanish", "English"]', true, false);
```

## Integration Steps

1. **Add to main app.js:**
```javascript
const experiencesRoutes = require('./routes/experiences');
app.use('/api/experiences', experiencesRoutes);
```

2. **Update API service in frontend:**
```javascript
// In apiService, the /experiences endpoint will be automatically available
```

3. **Database setup:**
- Create the experiences table
- Insert sample data
- Ensure proper indexes for performance

This structure follows Airbnb's model with:
- Experiences instead of tours
- Host information
- Multiple images per experience
- Detailed metadata (highlights, included items, languages)
- Rating and review system
- Instant booking capability
- Category filtering