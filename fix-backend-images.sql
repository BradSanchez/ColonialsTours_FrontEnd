-- Arreglar la columna images en la tabla tours
ALTER TABLE tours ADD COLUMN IF NOT EXISTS images JSON;

-- Actualizar tours existentes para tener el campo images como array
UPDATE tours SET images = JSON_ARRAY(image_url) WHERE image_url IS NOT NULL AND images IS NULL;
UPDATE tours SET images = JSON_ARRAY() WHERE image_url IS NULL AND images IS NULL;