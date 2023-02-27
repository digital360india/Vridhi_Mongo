import mongoose from 'mongoose';

const UnitSchema = new mongoose.Schema({
    Unit_Owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    Purchase_Date: { type: Date, required: true, default: Date.now },
    Profit_Generated: { type: Number, required: true, default: 0 , ref: 'User' }
});

const unitModel = mongoose.model('Unit', UnitSchema);

export default unitModel;