import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true, default: " " },
    address: { type: String, required: true, default: " " },
    type: { type: String },
    flatNo: { type: String, required: true, default: " " },
    area: { type: String, required: true, default: " " },
    balcony: { type: Number, required: true, default: 0 },
    marketValue: { type: Number, required: true, default: 0 },
    others: { type: String, required: true, default: " " },
    photos: [{ type: String, required: true, default: " " }],
    video: { type: String, required: true, default: " " },
    noOfTokens: { type: Number, required: true, default: 0 },
    soldTokens: { type: Number, required: true, default: 0 },
    tokenValue: { type: Number, required: true, default: 0 },
    Status: { type: String, required: true, default: "Active" },
    tokens: [{ type: Object, required: true }],
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const propertyModel = mongoose.model('Property', PropertySchema);

export default propertyModel;