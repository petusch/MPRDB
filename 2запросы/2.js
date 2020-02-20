//выборка в интервале
db.students.find({class_number: {$gt: 7, $lt: 10}}, {student_name: 1}).comment("Выводим имена студентов, обучающихся  в 8, 9 классах").pretty();
db.students.aggregate({$match: {class_number: {$gt: 7, $lt: 10}}}, {$project: {student_name: 1}}).pretty();

//выборка из заданного списка значений
db.marks.find({quarters: {$in: [1, 2, 3, 4]}}).comment("Вывод учащихся, которые обучаются в классах [5, 6, 8]").pretty();
db.students.aggregate({$match: {class_number: {$in: [5, 6, 8]}}}).pretty();