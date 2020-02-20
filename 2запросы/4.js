//выборка данных за конкретный период времени
db.timetable.find({Date: {$gt: new Date('2010-01-01'), $lt: new Date('2020-01-01')}}).comment("Вывод расписания между 2010-01-01 и 2020-01-01").pretty();
db.timetable.aggregate({$match: {Date: {$gt: new Date('2010-01-01'), $lt: new Date('2020-01-01')}}}).pretty();

//выборка данных на сегодняшний день
const today = new Date();
today.setMinutes(new Date().getMinutes() - 60);
today.setHours(0, 0, 0, 0);
db.timetable.find({Date: {$gt: today, $lt: new ISODate()}}).pretty();
db.timetable.aggregate({$match: {Date: {$gt: today, $lt: new ISODate()}}}).pretty();

//выборка данных за последний месяц
let lastMonth = new Date();
lastMonth.setMonth(new Date().getMonth() - 1);
db.timetable.find({Date: {$gt: lastMonth, $lt: new ISODate()}}).pretty();
db.timetable.aggregate({$match: {Date: {$gt: lastMonth, $lt: new ISODate()}}}).pretty();