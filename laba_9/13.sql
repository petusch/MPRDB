SELECT d.name, COUNT(d_o.*) AS orders_count 
  FROM delivery AS d JOIN delivery_orders AS d_o ON d.id = d_o.delivery_id
	GROUP BY d.name
  ORDER BY orders_count DESC
  LIMIT 1
UNION 	
	SELECT p.name, COUNT(p_o.*) AS orders_count 
  FROM payments AS p LEFT JOIN payments_orders AS p_o ON p.id = p_o.payment_id
	GROUP BY p.name
  ORDER BY orders_count DESC
  LIMIT 1
