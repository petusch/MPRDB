//1-9
const lastTenYears = new Date();
lastTenYears.setFullYear(new Date().getFullYear() - 10);
db.timetable.find({lesson_number: {$gt: 1, $lt: 5}, Date: {$gt: lastTenYears, $lt: new ISODate()}}).sort({lesson_number: 1}).map(({lesson_number}) => {
	return db.teachers.findOne({_id: lesson_number});
});
db.timetable.aggregate(
	{$match: {lesson_number: {$gt: 1, $lt: 5}, Date: {$gt: lastTenYears, $lt: new ISODate()}}},
	{$sort: {lesson_number: 1}},
	{$lookup: {from: "teachers", localField: "lesson_number", foreignField: "_id", as: "result"}},
	{$unwind: "$result"},
	{$project: {"result": 1}}).pretty();