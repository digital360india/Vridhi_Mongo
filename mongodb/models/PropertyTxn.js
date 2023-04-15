import mongoose from 'mongoose';

const PropertyTxnSchema = new mongoose.Schema({
    Status: { type: String, required: true },
    Date: { type: Date, required: true, default: Date.now },
    noOfTokens: { type: Number, required: true },
    tokens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Token' }],
    custId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    Amount: { type: Number, required: true },
    Transaction_Number: { type: String, required: true }
});

const propertyTxnModel = mongoose.model('PropertyTxn', PropertyTxnSchema);

export default propertyTxnModel;