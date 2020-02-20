UPDATE orders SET o.discount = (o.price - d.price) * 0.5, o.price = o.price - (o.price - d.price) * 0.5
FROM orders AS o JOIN accounts AS a ON o.user_id = a.user_id
JOIN delivery_orders AS d_o ON o.id = d_o.order_id
JOIN delivery AS d ON d_o.delivery_id = d.id
WHERE a.is_vip = TRUE AND o.status = 'N'