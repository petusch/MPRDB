//Выборка всех данных
db.patients.find().comment("Вывод всех пациентов").pretty();
db.patients.aggregate().pretty();

//Фильтрация по полю
db.patients.find({therapist_id: 2}).comment("Вывод всех пациентов второго врача").pretty();
db.patients.aggregate({$match: {therapist_id: 2}}).pretty();

//Фильтрация по массиву
db.ward.find({quarters: 2}).comment("Если в массиве quarters есть оценка 6, то выводим информацию об этом объекте").pretty();
db.marks.aggregate({$match: {quarters: 6}}).pretty();

//фильтрация по встроенному объекту
db.forTask.find({"exobj.firstname": "haha"}, {firstname: 0, surname: 0}, {$comment: "Если во вложенном объекте exobj есть имя haha, то выводим информацию об объекте"}).pretty();
db.forTask.aggregate({$match: {"exobj.firstname": "haha"}}, {$project: {name: 0, surname: 0}}).pretty();
