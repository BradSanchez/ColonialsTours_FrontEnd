# Setup para Subida de Imágenes

## 1. Instalar dependencia en el backend
```bash
npm install multer
```

## 2. Agregar al app.js del backend
```javascript
const path = require('path');
const uploadRoutes = require('./routes/upload');

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta para subir imágenes
app.use('/api/upload', uploadRoutes);
```

## 3. Crear el archivo routes/upload.js
Copiar el contenido de `backend-upload-routes.js`

## 4. Ejecutar SQL para agregar columna images
```sql
ALTER TABLE tours ADD COLUMN IF NOT EXISTS images JSON;
```

## 5. Reiniciar el backend

Ahora las imágenes se subirán al servidor y se guardarán correctamente en la base de datos.