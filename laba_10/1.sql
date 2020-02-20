CREATE VIEW view_avg_price AS 
SELECT
    u.login as login,
    AVG(o.price) as avg_price
FROM users AS u
  LEFT JOIN orders AS o ON o.user_id = u.id
GROUP BY
  u.login;