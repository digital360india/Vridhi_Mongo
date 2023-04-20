import Unit from '../mongodb/models/unit.js';
import UserModel from '../mongodb/models/user.js';

import mongoose from 'mongoose';

const createUnit = async (req, res) => {
    try{
        const { Unit_Owner } = req.body;
        const session = await mongoose.startSession();
        session.startTransaction();

        const user = await UserModel.findOne({ Unit_Owner }).session(session);

        if (!user) throw new Error("User not found");
        const newUnit = await Unit.create({
            Unit_Owner,
        });
        user.Units.push(newUnit._id);
        user.collection.updateOne({_id: user._id}, {"$inc": {"No_of_Units": 1}});
        await user.save({ session });

        await session.commitTransaction();

        return res.status(200).json(newUnit);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

const getUnitInfoByID = async (req, res) => {
    try {
        const { id } = req.params;

        const unit = await Unit.findOne({ _id: id });

        if (user) {
            res.status(200).json(unit);
        } else {
            res.status(404).json({ message: "Unit not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            Unit_Owner,
            Purchase_Date,
        } = 
        req.body;
            
        await User.findByIdAndUpdate(
            { _id: id },
            { 
                Unit_Owner,
                Purchase_Date,
            }
        );

        res.status(200).json({ message: "Unit updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUnits = async (req, res) => {
    try {
        const units = await Unit.find({});

        return res.status(200).json(units);
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
}

export {
    createUnit,
    getUnitInfoByID,
    updateUnit,
    getAllUnits
};