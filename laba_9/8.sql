SELECT p.id, SUM(b.quantity) AS sum_b
FROM products AS p JOIN basket AS b ON p.id = b.product_id
WHERE p.order_id IS NULL 
GROUP BY p.id
HAVING sum_b > p.quantity