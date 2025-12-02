# Fix para Múltiples Imágenes en Tours

## Problema
El backend solo guarda `image_url` (una imagen) pero no el array `images` (múltiples imágenes).

## Solución

### 1. Actualizar Base de Datos
Ejecutar el script SQL `update-tours-table.sql`:

```sql
-- Agregar columna images a la tabla tours
ALTER TABLE tours ADD COLUMN images JSON AFTER image_url;

-- Migrar datos existentes
UPDATE tours 
SET images = JSON_ARRAY(image_url) 
WHERE image_url IS NOT NULL AND image_url != '';

-- Para tours sin imagen, establecer array vacío
UPDATE tours 
SET images = JSON_ARRAY() 
WHERE image_url IS NULL OR image_url = '';
```

### 2. Verificar Rutas del Backend
Las rutas en `backend-routes.js` ya están actualizadas para:

- **POST /api/tours**: Guarda tanto `image_url` (primera imagen) como `images` (array completo)
- **PUT /api/tours/:id**: Actualiza ambos campos
- **GET /api/tours**: Parsea el JSON de `images` antes de enviar al frontend
- **GET /api/tours/saved**: También parsea el JSON de `images`

### 3. Estructura de Datos
```javascript
// Al crear/actualizar un tour
{
  title: "Tour Example",
  description: "...",
  images: [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg", 
    "https://cloudinary.com/image3.jpg",
    "https://cloudinary.com/image4.jpg"
  ]
}

// En la base de datos se guarda:
// image_url: "https://cloudinary.com/image1.jpg" (primera imagen)
// images: '["https://cloudinary.com/image1.jpg", "https://cloudinary.com/image2.jpg", ...]'
```

### 4. Verificar Frontend
El componente `MultiImageUpload.jsx` ya está configurado para enviar el array `images` correctamente.

### 5. Pasos para Aplicar
1. Ejecutar el script SQL en tu base de datos
2. Reiniciar el servidor backend
3. Probar creando un tour con múltiples imágenes
4. Verificar que se guarden todas las imágenes en la base de datos

### 6. Verificación
Después de aplicar los cambios, un tour debería verse así en la base de datos:

```sql
SELECT id, title, image_url, images FROM tours WHERE id = 19;
```

Resultado esperado:
```
id: 19
title: "test1"  
image_url: "https://cloudinary.com/image1.jpg"
images: ["https://cloudinary.com/image1.jpg", "https://cloudinary.com/image2.jpg", "https://cloudinary.com/image3.jpg", "https://cloudinary.com/image4.jpg"]
```