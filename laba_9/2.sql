SELECT DISTINCT o.user_id 
FROM orders o JOIN payments_orders po ON o.id = po.order_id
GROUP BY o.user_id
HAVING SUM(po.value) < o.price