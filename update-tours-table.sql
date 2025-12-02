-- Agregar columna images a la tabla tours para soportar múltiples imágenes
ALTER TABLE tours ADD COLUMN images JSON AFTER image_url;

-- Migrar datos existentes: convertir image_url a array en images
UPDATE tours 
SET images = JSON_ARRAY(image_url) 
WHERE image_url IS NOT NULL AND image_url != '';

-- Para tours sin imagen, establecer array vacío
UPDATE tours 
SET images = JSON_ARRAY() 
WHERE image_url IS NULL OR image_url = '';