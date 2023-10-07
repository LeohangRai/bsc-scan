import { Document, Model, model, Schema } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SERVER_CONFIGS } from '../configs';

export interface UserDocument extends Document {
  username: string;
  email: string;
  contact: string;
  gender: string;
  age: number;
  password: string;

  isPasswordValid: (password: string) => boolean;
}

const userSchema = new Schema<UserDocument>({
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

userSchema.methods.isPasswordValid = function (password: string) {
  return compareSync(password, this.password);
};

userSchema.methods.createAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username
    },
    SERVER_CONFIGS.JWT_SECRET
  );
};

/* serializer definition */
userSchema.methods.toJSON = function () {
  return {
    _id: this._id,
    username: this.username,
    token: this.createAuthToken()
  };
};

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = hashSync(this.password ?? '', 10);
  }
  return next();
});

export const User: Model<UserDocument> = model<UserDocument>(
  'User',
  userSchema
);
