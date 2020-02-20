
db.students.aggregate([{$lookup: {from: "marks", localField: "_id", foreignField: "student_id", as: "result"}}, 
{$unwind: "$result"}, 
{$unwind: "$result.quarters"},
{$sort: {"result.quarters": 1}},
{$sort: {student_name: 1}}, 
{$project: {student_name: 1, "result.quarters": 1}}]).pretty();