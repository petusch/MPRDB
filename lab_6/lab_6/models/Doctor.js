import { model, Schema } from 'mongoose';
import { DOCTOR_MODEL, USER_MODEL } from '../constants/models'
import User from './User';

const DoctorSchema = new Schema(
	{
		name: {
			type: String,
			require: true
        },
        surname: {
			type: String,
			require: true
        },
        cabinet_number: {
			type: String,
			require: true
        },
        adrees:{
            type: String,
			require: true
        },
        speciality: {
            type: String,
            require: true
		},
		user_id: {
			type: Schema.Types.ObjectId,
			require: true,
			ref: USER_MODEL
		},
	},
);

DoctorSchema.statics = {
	findAll() {
		return this.find();
	},

 	async findOneById(_id) {
    return this.findOne({ _id })
   },

   async findByUser(user_id) {
     return this.findOne({ user_id })
   },

   async deleteOneById(_id) {
    return this.deleteOne({ _id });
  },
}


const DoctorModel = model(DOCTOR_MODEL, DoctorSchema);

export default DoctorModel;

