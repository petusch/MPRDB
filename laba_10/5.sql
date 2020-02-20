create function update_orders() returns trigger as $$ 
declare is_paid boolean;
begin
select
  (order.price = sum(payment_order.value)) into is_paid
from
  orders order
  right join payments_orders payment_order on payment_order.order_id = order.id
where
  order.id = NEW.id
group by
  order.id;

if is_paid then
  update
    order
  set
    order.status = 'P'
  from
    orders
  where
    order.id = NEW.id;

  update
    product
  set
    product.quantity = product.quantity - paid_product_basket.quantity
  from
    products,
    (
      select
        product_basket.*
      from
        basket product_basket
      where
        product_basket.order_id = NEW.id
        and product_basket.product_id = product.id
    ) as paid_product_basket;
end if;

return NEW;
end;
$$ language plpgsql;

create trigger trigger_order_update
after insert or update of payments_orders on orders 
for each row
  execute procedure update_orders();