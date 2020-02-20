WITH t AS (
	SELECT date_part ('day', current_date :: timestamp - b.created_at :: timestamp) AS d_p FROM basket
)	
SELECT u.id FROM users AS u 
  JOIN customers AS c ON u.id = c.user_id
	JOIN basket AS b ON c.id = b.customer_id
WHERE b.order_id IS NULL AND t.d_p <= 30
