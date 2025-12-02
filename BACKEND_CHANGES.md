# Cambios Necesarios en el Backend para Múltiples Imágenes

## 1. Modificaciones en la Base de Datos

### Tabla `tours` - Agregar columna para múltiples imágenes:

```sql
-- Agregar columna para almacenar array de imágenes
ALTER TABLE tours ADD COLUMN images JSON;

-- Migrar datos existentes (opcional)
UPDATE tours SET images = JSON_ARRAY(image_url) WHERE image_url IS NOT NULL;
```

### Tabla `users` - Asegurar rol de guía:

```sql
-- Verificar que el enum incluya 'guide'
ALTER TABLE users MODIFY COLUMN role ENUM('user', 'admin', 'guide') DEFAULT 'user';
```

## 2. Endpoints del Backend

### Endpoints para Administradores (existentes - modificar):

#### POST `/api/tours` - Crear tour
```json
{
  "title": "Tour Colonial",
  "description": "Descripción del tour",
  "price": 55.00,
  "duration": "3h",
  "location": "Zona Colonial",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ],
  "imageUrl": "https://example.com/image1.jpg" // Mantener compatibilidad
}
```

#### PUT `/api/tours/:id` - Actualizar tour
```json
{
  "title": "Tour Colonial Actualizado",
  "description": "Nueva descripción",
  "price": 60.00,
  "duration": "3.5h",
  "location": "Zona Colonial",
  "images": [
    "https://example.com/new-image1.jpg",
    "https://example.com/new-image2.jpg"
  ],
  "imageUrl": "https://example.com/new-image1.jpg"
}
```

### Nuevos Endpoints para Guías:

#### GET `/api/guide/tours` - Obtener tours del guía
```javascript
// Respuesta
{
  "success": true,
  "tours": [
    {
      "id": 1,
      "title": "Tour Colonial",
      "description": "Descripción",
      "price": 55.00,
      "duration": "3h",
      "location": "Zona Colonial",
      "images": ["url1.jpg", "url2.jpg"],
      "image_url": "url1.jpg", // Primera imagen para compatibilidad
      "guide_id": 123,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### POST `/api/guide/tours` - Crear tour como guía
```javascript
// Request body
{
  "title": "Mi Tour",
  "description": "Descripción del tour",
  "price": 45.00,
  "duration": "2h",
  "location": "Centro Histórico",
  "images": ["image1.jpg", "image2.jpg", "image3.jpg"]
}

// Respuesta
{
  "success": true,
  "message": "Tour creado exitosamente",
  "tour": {
    "id": 15,
    "title": "Mi Tour",
    // ... otros campos
  }
}
```

#### PUT `/api/guide/tours/:id` - Actualizar tour del guía
```javascript
// Solo permite actualizar tours propios del guía
// Mismo formato que POST
```

#### DELETE `/api/guide/tours/:id` - Eliminar tour del guía
```javascript
// Solo permite eliminar tours propios del guía
{
  "success": true,
  "message": "Tour eliminado exitosamente"
}
```

### Modificar Endpoints Existentes:

#### GET `/api/tours` - Listar todos los tours
```javascript
// Agregar campo images a la respuesta
{
  "success": true,
  "tours": [
    {
      "id": 1,
      "title": "Tour Colonial",
      "images": ["url1.jpg", "url2.jpg", "url3.jpg"],
      "image_url": "url1.jpg", // Mantener para compatibilidad
      // ... otros campos
    }
  ]
}
```

#### GET `/api/tours/:id` - Obtener tour específico
```javascript
// Incluir todas las imágenes en la respuesta
{
  "success": true,
  "tour": {
    "id": 1,
    "title": "Tour Colonial",
    "images": ["url1.jpg", "url2.jpg", "url3.jpg"],
    "image_url": "url1.jpg",
    // ... otros campos
  }
}
```

## 3. Middleware de Autenticación

### Verificar rol de guía:
```javascript
const requireGuideRole = (req, res, next) => {
  if (req.user.role !== 'guide') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de guía.'
    });
  }
  next();
};
```

### Verificar propiedad del tour:
```javascript
const requireTourOwnership = async (req, res, next) => {
  const tourId = req.params.id;
  const tour = await Tour.findById(tourId);
  
  if (!tour || tour.guide_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para modificar este tour.'
    });
  }
  
  req.tour = tour;
  next();
};
```

## 4. Validaciones

### Validar imágenes:
```javascript
const validateTourImages = (req, res, next) => {
  const { images } = req.body;
  
  if (images && Array.isArray(images)) {
    // Validar que no exceda el límite
    if (images.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Máximo 10 imágenes permitidas por tour.'
      });
    }
    
    // Validar URLs de imágenes
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
    const invalidUrls = images.filter(url => !urlPattern.test(url));
    
    if (invalidUrls.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'URLs de imágenes inválidas detectadas.'
      });
    }
    
    // Establecer image_url como primera imagen para compatibilidad
    req.body.imageUrl = images[0];
  }
  
  next();
};
```

## 5. Ejemplo de Implementación en Node.js/Express

```javascript
// routes/guide.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireGuideRole, requireTourOwnership } = require('../middleware/auth');
const { validateTourImages } = require('../middleware/validation');

// Obtener tours del guía
router.get('/tours', requireAuth, requireGuideRole, async (req, res) => {
  try {
    const tours = await Tour.find({ guide_id: req.user.id });
    res.json({ success: true, tours });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// Crear nuevo tour
router.post('/tours', requireAuth, requireGuideRole, validateTourImages, async (req, res) => {
  try {
    const tourData = {
      ...req.body,
      guide_id: req.user.id,
      guide_name: req.user.name
    };
    
    const tour = await Tour.create(tourData);
    res.json({ success: true, tour, message: 'Tour creado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creando tour' });
  }
});

// Actualizar tour
router.put('/tours/:id', requireAuth, requireGuideRole, requireTourOwnership, validateTourImages, async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, tour: updatedTour, message: 'Tour actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error actualizando tour' });
  }
});

// Eliminar tour
router.delete('/tours/:id', requireAuth, requireGuideRole, requireTourOwnership, async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Tour eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error eliminando tour' });
  }
});

module.exports = router;
```

## 6. Consideraciones Adicionales

### Almacenamiento de Imágenes:
- Implementar servicio de upload (AWS S3, Cloudinary, etc.)
- Validar tamaño y formato de imágenes
- Generar thumbnails automáticamente
- Implementar CDN para mejor rendimiento

### Optimizaciones:
- Lazy loading de imágenes en el frontend
- Compresión automática de imágenes
- Cache de imágenes en el navegador
- Preload de primera imagen

### Seguridad:
- Validar tipos de archivo permitidos
- Escanear imágenes por malware
- Limitar tamaño de archivos
- Rate limiting en endpoints de upload

Este documento proporciona todos los cambios necesarios en el backend para soportar múltiples imágenes en tours, tanto para administradores como para guías.