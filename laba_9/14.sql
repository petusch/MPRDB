DELETE FROM categories WHERE id NOT IN (SELECT DISTINCT category_id FROM products)
