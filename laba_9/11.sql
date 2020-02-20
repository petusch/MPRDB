SELECT o.id, COUNT(*), SUM(po.value) AS payed_sum
FROM orders AS o JOIN payments_orders AS po ON o.id = po.order_id
WHERE po.payment_id IS NULL AND po.from_account = TRUE
GROUP BY o.id
HAVING payed_sum = o.price