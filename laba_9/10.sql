WITH pbo AS ( 
SELECT p.id FROM products AS p 
JOIN basket AS b ON p.id = b.product_id
JOIN orders AS o ON b.order_id = o.id
WHERE o.status = 'P' OR o.status = 'F'
GROUP BY o.id
HAVING COUNT(o.id) <= 10
)
UPDATE products SET p.discount = p.discount + 0.1 * (p.price - p.discount), p.price = p.price - 0.1 * (p.price - p.discount)
WHERE p.id IN (SELECT id FROM pbo)