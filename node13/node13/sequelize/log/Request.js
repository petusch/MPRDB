import { model, Schema } from 'mongoose';

const RequestSchema = new Schema({
  date: {
    required: true,
    type: Date,
  },
  clientIp: {
    required: true,
    type: String,
  },
  path: {
    required: true,
    type: String,
  },
  userAgent: {
    required: true,
    type: String,
  },
});

const RequestModel = model('Request', RequestSchema);

export default RequestModel;