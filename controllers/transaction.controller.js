import Transaction from '../mongodb/models/transaction.js';
import UserModel from '../mongodb/models/user.js';
import Unit from '../mongodb/models/unit.js';
import NoOfUsers from '../mongodb/models/noOfUsers.js';

import mongoose from 'mongoose';

const createTransaction = async (req, res) => {
    try{
        const { Status, No_of_Units, User, Amount } = req.body;
        
        const session = await mongoose.startSession();
        session.startTransaction();
        const user = await UserModel.findOne({_id: User}).session(session);
        if (!user) throw new Error("User not found");

        const numUser = await NoOfUsers.findOne({ _id: process.env.NO_OF_USERS_OBJ_ID });

        const newTransaction = await Transaction.create({
            Status,
            Current_Price: numUser.Current_Price,
            No_of_Units,
            User: user._id,
            Amount 
        });
        
        if(newTransaction.Status === "Success"){
            let docs = [];
            let unitIds = [];
            for(let i=0;i<No_of_Units;i++){
                const newUnit = await Unit.create({ "Unit_Owner": user._id });
                user.Units.push(newUnit._id);
                newTransaction.Units.push(newUnit._id);
                unitIds.push(newUnit._id);
                docs.push(newUnit);
            }
            Unit.insertMany(docs).then(function(){
                console.log("Data inserted")  // Success
            }).catch(function(error){
                console.log(error)      // Failure
            });
            user.Basic = Number.parseInt(user.Basic) + Number.parseInt(Amount);
        }
        

        user.Transactions.push(newTransaction._id);
        user.No_of_Units= user.Units.length;
        
        await user.save({ session });
        await session.commitTransaction();

        const session1 = await mongoose.startSession();
        session1.startTransaction();
        const transaction = await Transaction.findOne({_id: newTransaction._id}).session(session1);
        await transaction.collection.updateOne({_id: newTransaction._id}, {$set: {"Units": unitIds}});
        await transaction.save({ session });
        await session1.commitTransaction();

        return res.status(200).json(newTransaction);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({}).limit(req.query._end);

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTransactionInfoByID = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await Transaction.find({ User: id });

        if (transaction) {
            res.status(200).json(transaction);
        } else {
            res.status(404).json({ message: "Transaction not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await Transaction.find({ _id: id });

        if (transaction) {
            res.status(200).json(transaction);
        } else {
            res.status(404).json({ message: "Transaction not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    createTransaction,
    getTransactionInfoByID,
    getAllTransactions,
    getTransaction
};