DELETE FROM products AS p
WHERE p.id NOT IN (SELECT product_id FROM basket)