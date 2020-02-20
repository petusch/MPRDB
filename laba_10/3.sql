create function update_order_info (order_id bigserial) as $ $ 
declare 
order_price money,
delivery_price money;

begin
select
  sum(product_basket.price) into order_price,
  delivery_record.price into delivery_price
from
  orders order
  left join basket as product_basket on product_basket.order_id = order.id
  left join delivery_orders as delivery_order on delivery_order.order_id = order.id
  left join delivery as delivery_record on delivery_order.delivery_id = delivery_record.id
where
  order.id = $ 1;

update
  order
set
  order.price = order_price + delivery_price
from
  orders
where
  order.id = $ 1
end;

$ $ language plpgsql;