import { Document, model, Schema } from 'mongoose';

export interface WalletDocument extends Document {
  address: string;
  name_tag?: string;
  balance: string;
  user_id: Schema.Types.ObjectId;
}

const walletSchema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name_tag: {
    type: String,
    trim: true
  },
  balance: {
    type: String,
    trim: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

walletSchema.methods.toJSON = function () {
  return {
    address: this.address,
    name_tag: this.name_tag,
    balance: this.balance
  };
};

const Wallet = model<WalletDocument>('Wallet', walletSchema);
export default Wallet;
