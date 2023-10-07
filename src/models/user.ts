import mongoose from 'mongoose';
import { hashSync, compareSync } from 'bcrypt';

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
    trim: true
  },
  gender: {
    type: String,
    trim: true
  },
  age: {
    type: Number
  },
  password: {
    type: String
  }
});

userSchema.methods = {
  isPasswordValid(password: string) {
    return compareSync(password, this.password);
  }
};

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = hashSync(this.password ?? '', 10);
  }
  return next();
});

const User = mongoose.model('User', userSchema);
export default User;
