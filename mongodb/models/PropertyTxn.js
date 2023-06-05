import mongoose from 'mongoose';

const PropertyTxnSchema = new mongoose.Schema({
    Status: { type: String, required: true },
    Date: { type: Date, required: true, default: Date.now },
    noOfTokens: { type: Number, required: true },
    tokens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Token' }],
    custId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    tokenPrice: { type: Number, required: true },
    Amount: { type: Number, required: true },
    Transaction_Number: { type: String, required: true },
    paymentMethod: { type: String, required: true, default: " " }
});

const propertyTxnModel = mongoose.model('PropertyTxn', PropertyTxnSchema);

export default propertyTxnModel;