create function pay_value (login varchar, value money) returns money as $ $ declare account_value money;

begin
select
  account.value into account_value
from
  users as user
  join accounts as account on account.user_id = user.id
where
  user.login = $ 1;

if account_value < $ 2 then raise exception;

else
update
  account
set
  accout.value = account_value - $ 2
from
  accounts
  join users as user on account.user_id = user.id
where
  user.login = $ 1;

return account_value - $ 2;

end if;

end;

$ $ language plpgsql;