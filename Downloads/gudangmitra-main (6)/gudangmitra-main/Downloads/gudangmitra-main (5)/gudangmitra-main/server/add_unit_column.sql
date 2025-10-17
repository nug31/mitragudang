-- Add unit column to items table
ALTER TABLE items
ADD COLUMN unit VARCHAR(50) DEFAULT 'units';

-- Update existing paper items to use 'lembar' as unit
UPDATE items 
SET unit = 'lembar'
WHERE LOWER(name) LIKE '%kertas%' OR LOWER(name) LIKE '%paper%';