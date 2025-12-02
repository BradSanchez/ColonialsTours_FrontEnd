-- Agregar columna images a la tabla tours
ALTER TABLE tours ADD COLUMN images JSON AFTER image_url;

-- Migrar datos existentes
UPDATE tours 
SET images = JSON_ARRAY(image_url) 
WHERE image_url IS NOT NULL AND image_url != '';

UPDATE tours 
SET images = JSON_ARRAY() 
WHERE image_url IS NULL OR image_url = '';