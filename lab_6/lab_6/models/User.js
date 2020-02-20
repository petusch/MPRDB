import { model, Schema } from 'mongoose';
import { USER_MODEL } from '../constants/models'
import Doctor from './Doctor';
import Patient from './Patient';

const UserSchema = new Schema(
	{
		login: {
			type: String,
			require: true,
			unique: true
		},
		password: {
			type: String,
			require: true
		},
		lastname: {
			type: String,
			require: true
		},
		firstname: {
			type: String,
			require: true
		},
		userData: {
			dob: Date,
			image: String
		},
		roles: [String]
	},
);

UserSchema.statics = {
	 findAll() {
		return this.find();
	},

	async findOneById(_id) {
		return this.findOne({ _id });
	},

	async findOneByLogin(login) {
		return this.findOne({ login }); 
	},
	async deleteOneById(_id) {
		const doctors = await Doctor.find({ user_id: _id });
		doctors.forEach((d) => Doctor.deleteOneById(d['_id']));

		const patients = await Patient.find({ user_id: _id });
		patients.forEach((p) => Patient.deleteOneById(p['_id']));
		
		return this.deleteOne({ _id });
	},
 
};

UserSchema.set('toJSON', {
	transform: (doc, user) => {
		const normalizedUser = { ...user };

		delete normalizedUser.password;

		return normalizedUser;
	},
});

const UserModel = model(USER_MODEL, UserSchema);

export default UserModel;
