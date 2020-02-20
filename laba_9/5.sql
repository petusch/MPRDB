SELECT u.id, o.status,
  COUNT(o.user_id) FILTER (WHERE o.status = "N") AS n_count,
  COUNT(o.user_id) FILTER (WHERE o.status = "D") AS d_count,
  COUNT(o.user_id) FILTER (WHERE o.status = "P") AS p_count,
  COUNT(o.user_id) FILTER (WHERE o.status = "F") AS f_count,
  COUNT(o.user_id) FILTER (WHERE o.status = "C") AS c_count
FROM users AS u JOIN orders AS o ON u.id = o.user_id
GROUP BY u.id, o.status;