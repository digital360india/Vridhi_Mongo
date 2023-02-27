import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
    Name: { type: String, required: true, default: " " },
    email: { type: String, required: true, default: " " },
    Phone_number: { type: String, required: true },
    Gender: { type: String, required: true, default: " " },
    DOB: { type: String, required: true, default: " " },
    No_of_Units: { type: Number, required: true, default: 0 },
    Profit: { type: Number, required: true, default: 0, ref: 'Unit' },
    Basic: { type: Number, required: true, default: 0 },
    Wallet: { type: Number, required: true, default: 0 },
    Units: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' }], 
    Transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
});

const userModel = mongoose.model('User', UserSchema);

export default userModel;