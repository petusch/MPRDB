//сортировка по одному полю

db.students.find().sort({class_number: 1}).pretty();
db.students.aggregate({$sort: {students_name: 1}}).pretty();

//сортировка по нескольким полям

db.students.find().sort({student_name: 1, class_number: 1}).pretty();
db.students.aggregate({$sort: {student_name: 1, class_number: 1}}).pretty();