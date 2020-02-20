create function update_trigger() returns trigger as $ $ 
begin
  execute procedure update_order_info(NEW.id)
  return NEW;
end;

$ $ language plpgsql;

create trigger trigger_basket_update
after insert or update
  of basket on orders for each row
execute procedure update_trigger();