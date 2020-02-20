SELECT o.id, MIN(b.created_at) AS basket_first,
  MAX(p_o.created_at) AS payment_last,
  SUM(p_o.value) AS paid_value
FROM
  orders AS o
  JOIN payments_orders AS p_o ON p_o.order_id = o.id
  JOIN basket AS b ON p_b.order_id = o.id
WHERE 
  o.price = paid_value
  AND 
  (SELECT date_part('hour', payment_last :: timestamp - basket_first :: timestamp)) <= 1;