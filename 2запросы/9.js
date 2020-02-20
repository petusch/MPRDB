//вывод данных с n-ого по m-ый номер

let n = 2, m = 4;
db.students.find().skip(n - 1).limit(m - n + 1).pretty();
db.students.aggregate({$skip: n - 1}, {$limit: m - n + 1}).pretty();