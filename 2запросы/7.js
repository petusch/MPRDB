//выборка ограниченного набора полей

db.students.find().limit(2).pretty();
db.students.aggregate({$limit: 2}).pretty();

db.students.find().skip(2).pretty();
db.students.aggregate({$skip: 4}).pretty();