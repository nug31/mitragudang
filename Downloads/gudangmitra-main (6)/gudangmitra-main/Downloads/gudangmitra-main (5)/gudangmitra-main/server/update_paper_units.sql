UPDATE items 
SET unit = 'lembar' 
WHERE LOWER(name) LIKE '%kertas%' 
   OR LOWER(name) LIKE '%paper%'
   OR LOWER(description) LIKE '%kertas%'
   OR LOWER(description) LIKE '%paper%';