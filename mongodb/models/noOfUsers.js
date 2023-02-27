import mongoose from 'mongoose';

const No_Of_UsersSchema = new mongoose.Schema({
    Current_Price: { type: Number, required: true, default: 2500, ref: 'User' },
    No_Of_Users: { type: Number, required: true, ref: 'User' },
});

const No_Of_UsersModel = mongoose.model('No_Of_Users', No_Of_UsersSchema);

export default No_Of_UsersModel;