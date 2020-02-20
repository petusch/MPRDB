//Выборка данных из нескольких таблиц

db.teachers.find({_id: 5}).map(({_id}) => {
	return db.class.findOne({classroom_teacher: _id});
});

db.teachers.aggregate([{$lookup: {from: "class", localField: "_id", foreignField: "classroom_teacher", as: "result"}}, {$unwind: "$result"}, {$project: {"result": 1}}]).pretty();