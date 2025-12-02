# Backend Setup Instructions

## 1. Database Setup
Execute the SQL commands in `backend-implementation.sql`:
```bash
mysql -u your_username -p your_database < backend-implementation.sql
```

## 2. Install Dependencies (if not already installed)
```bash
npm install express mysql2 jsonwebtoken bcryptjs cors
```

## 3. Update Routes
Replace or update your existing `routes/tours.js` with the code from `backend-routes.js`

## 4. Main App Configuration
Ensure your main app file includes:
```javascript
const express = require('express');
const cors = require('cors');
const toursRoutes = require('./routes/tours');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/tours', toursRoutes);

// Other routes...

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

## 5. Database Connection
Ensure you have a database connection setup (usually in `config/database.js`):
```javascript
const mysql = require('mysql2/promise');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database'
});

module.exports = db;
```

## 6. Test Endpoints
After setup, test these endpoints:
- GET `/api/tours` - Should include `is_saved` field
- POST `/api/tours/save` - Save a tour
- DELETE `/api/tours/saved/:tourId` - Remove saved tour
- GET `/api/tours/saved` - Get user's saved tours

## Features Implemented:
✅ Tours with categories
✅ Saved tours functionality
✅ is_saved field in tour responses
✅ Category filtering
✅ User-specific saved tours