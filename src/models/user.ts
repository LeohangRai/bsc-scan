import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },
  contact: {
    type: String,
    unique: true,
    trim: true
  },
  gender: {
    type: String,
    require: true,
    trim: true
  },
  age: {
    type: Number
  }
});

const User = mongoose.model('User', userSchema);
export default User;
