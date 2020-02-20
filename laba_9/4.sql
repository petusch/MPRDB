SELECT o.id 
FROM orders AS o JOIN payments_orders AS po ON o.id = po.order_id
GROUP BY o.id
HAVING SUM(po.value) < o.price