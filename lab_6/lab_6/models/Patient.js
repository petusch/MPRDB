import { model, Schema } from 'mongoose';
import { DOCTOR_MODEL, PATIENT_MODEL, USER_MODEL } from '../constants/models'

const PatientSchema = new Schema(
  {
    name: {
      type: String,
      require: true
    },
    phone: Number,
    doctor_id: {
      type: Schema.Types.ObjectId,
      ref: DOCTOR_MODEL
    },
    user_id: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: USER_MODEL
    },
    diagnoses: {
        disease: String,
        recording_date: Date,
        ordering_date: Date
    },
  },
);


PatientSchema.statics = {
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

const PatientModel = model(PATIENT_MODEL, PatientSchema);

export default PatientModel;

