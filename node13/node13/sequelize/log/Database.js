import { model, Schema } from 'mongoose';

const DatavaseSchema = new Schema({
  date: {
    required: true,
    type: Date,
  },
  type: {
    required: true,
    type: String,
  },
  table: {
    required: true,
    type: String,
  },
  data: {
    required: true,
    type: Object,
  },
});

const DatabaseModel = model('Database', DatavaseSchema);

export default DatabaseModel;