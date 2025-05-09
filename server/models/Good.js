import mongoose from 'mongoose';

const goodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model('Good', goodSchema);
