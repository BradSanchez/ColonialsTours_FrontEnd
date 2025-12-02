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

-- Add category column to tours table if not exists
ALTER TABLE tours ADD COLUMN category VARCHAR(50) DEFAULT 'Cultural';

-- Update existing tours with default category
UPDATE tours SET category = 'Cultural' WHERE category IS NULL;