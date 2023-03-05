import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    Status: { type: String, required: true },
    Current_Price: { type: Number, refPath: 'No_of_Users', field: 'Current_Price' },
    Date: { type: Date, required: true, default: Date.now },
    //Time: { type: String, required: true, default: { $type: "timestamp" } },
    No_of_Units: { type: Number, required: true },
    Units: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' }],
    User: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    Amount: { type: Number, required: true },
    Transaction_Number: { type: String, required: true }
});

const transactionModel = mongoose.model('Transaction', TransactionSchema);

export default transactionModel;