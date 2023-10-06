import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name_tag: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  balance: {
    type: String,
    trim: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;
