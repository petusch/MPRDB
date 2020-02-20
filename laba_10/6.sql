select
  user.login as login,
  order.price as price,
  sum(order.price) over (
    partition by order.id
  ) as sum
from
  orders as order
  left join users as user on order.user_id = user.id
order by
  order.created_at asc;