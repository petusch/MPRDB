UPDATE accounts SET accounts.value =  accounts.value + paid_value 
FROM accounts
  JOIN (SELECT SUM(p_o.value) AS paid_value 
    FROM orders AS o JOIN payments_orders AS p_o ON o.id = p_o.order_id
    WHERE o.status = 'C');