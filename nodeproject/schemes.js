const mongoose = require("mongoose");
const Schema = mongoose.Schema;
  

const doctorScheme = new Schema({
    id: Number,
    full_name: String,
    speciality: String,
    grade: String

});
const patientsScheme = new Schema({
    id: Number,
    full_name: String,
    diagnosis: String,
    enrolled_at: Date

});
const nurseScheme = new Schema({
    id: Number,
    doctors_affilation: Number,
    patients_affilation: Number

});
const departmentScheme = new Schema({
    id: Number,
    age_affilation: Boolean,
    name: String,
    chief_id: Number,
    amountOfpatients: Number

});
const wardScheme = new Schema({
    id: Number,
    capacity: Number,
    is_paid: Boolean,
    patients_id: Int32Array,
    affilation: String

});
// подключение
mongoose.connect("mongodb://localhost:27017/mongo1", { useNewUrlParser: true });
  
const Doctor = mongoose.model("doctors", doctorScheme);
const doctor = new Doctor({
    id: 12,
    full_name: "FIO",
    speciality: "Dentist",
    grade: "1st grade"
});

const Department = mongoose.model("department", departmentScheme);
const department = new Department({
    id: 12,
    age_affilation: false,
    name:"Dentist",
    chief_id:12,
    amountOfpatients: 10
});


const Ward = mongoose.model("ward", wardScheme);
const ward = new Ward({
    id: 12,
    capacity: 10,
    is_paid: true,
    patients_id: [1,3],
    affilation: "Common therapy"
});

const Patients = mongoose.model("patients", patientsScheme);
const patients = new Patients({
    id: 12,
    full_name:"chiki-pau-pau",
    diagnosis:"cancer",
    enrolled_at: 1231231
});

const Nurse = mongoose.model("nurse", nurseScheme);
const nurse = new Nurse({
    id: 12,
    name: "FIO",
    diagnosis: "cancer",
    enrolled_at: 1222222
});

doctor.save(function(err){
    mongoose.disconnect();  // отключение от базы данных
      
    if(err) return console.log(err);
    console.log("Сохранен объект", user);
});

department.save(function(err){
    mongoose.disconnect();  // отключение от базы данных
      
    if(err) return console.log(err);
    console.log("Сохранен объект", user);
});

nurse.save(function(err){
    mongoose.disconnect();  // отключение от базы данных
      
    if(err) return console.log(err);
    console.log("Сохранен объект", user);
});

patients.save(function(err){
    mongoose.disconnect();  // отключение от базы данных
      
    if(err) return console.log(err);
    console.log("Сохранен объект", user);
});

ward.save(function(err){
    mongoose.disconnect();  // отключение от базы данных
      
    if(err) return console.log(err);
    console.log("Сохранен объект", user);
});