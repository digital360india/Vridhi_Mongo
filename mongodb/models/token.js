import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    custId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, ref: 'User' },
    contactNumber: { type: String, ref: 'User' },
    Transaction_Number: { type: String, required: true },
    Purchase_Date: { type: Date, required: true, default: Date.now },
    tokenPrice: { type: Number, required: true, default: 0 },
    costPrice: { type: Number, required: true, default: 0 },
});

const tokenModel = mongoose.model('Token', TokenSchema);

export default tokenModel;