SELECT p.id, SUM(b.value) AS basket_value
FROM 
products AS p 
JOIN basket AS b ON p.id = b.product_id
JOIN (SELECT o.id, SUM(p_o.value) AS paid_value
  FROM orders AS o JOIN payment_orders AS p_o ON o.id = p_o.order_id
  GROUP BY o.id
  HAVING o.price = paid_value) 
  AS paid_orders ON b.order_id = paid_orders.id
GROUP BY p.id
ORDER BY basket_value DESC
LIMIT 10;