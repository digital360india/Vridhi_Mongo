import PropertyTxn from "../mongodb/models/PropertyTxn.js";
import UserModel from "../mongodb/models/user.js";
import Token from "../mongodb/models/token.js";

import mongoose from "mongoose";

const createPropertyTxn = async (req, res) => {
  try {
    const {
      Status,
      noOfTokens,
      custId,
      propertyId,
      tokenPrice,
      Amount,
      Transaction_Number,
    } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();
    const user = await UserModel.findOne({ _id: custId }).session(session);
    if (!user) throw new Error("User not found");

    const newTransaction = await PropertyTxn.create({
      Status,
      noOfTokens,
      custId,
      propertyId,
      tokenPrice,
      Amount,
      Transaction_Number,
    });
    var tokenIds = [];
    if (newTransaction.Status === "Success") {
      let docs = [];

      for (let i = 0; i < noOfTokens; i++) {
        const newToken = await Token.create({
          custId,
          propertyId,
          tokenPrice,
          costPrice: Amount,
          Transaction_Number,
        });
        user.tokens.push(newToken._id);
        newTransaction.tokens.push(newToken._id);
        tokenIds.push(newToken._id);
        docs.push(newToken);
      }
      Token.insertMany(docs)
        .then(function () {
          console.log("Data inserted"); // Success
        })
        .catch(function (error) {
          console.log(error); // Failure
        });
    }

    user.propertyTxn.push(newTransaction._id);
    user.noOfTokens = user.tokens.length;

    await user.save({ session });
    await session.commitTransaction();

    const session1 = await mongoose.startSession();
    session1.startTransaction();
    const transaction = await PropertyTxn.findOne({
      _id: newTransaction._id,
    }).session(session1);
    if (transaction.Status === "Success")
      await transaction.collection.updateOne(
        { _id: newTransaction._id },
        { $set: { tokens: tokenIds } }
      );
    await transaction.save({ session });
    await session1.commitTransaction();

    return res.status(200).json(newTransaction);
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};

const getAllPropertyTxn = async (req, res) => {
    try {
        const transactions = await PropertyTxn.find();

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { createPropertyTxn, getAllPropertyTxn }
