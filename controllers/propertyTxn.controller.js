import PropertyTxn from "../mongodb/models/PropertyTxn.js";
import UserModel from "../mongodb/models/user.js";
import Token from "../mongodb/models/token.js";
import Property from "../mongodb/models/property.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

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
      paymentMethod,
    } = req.body;

    const newTransaction = await PropertyTxn.create({
      Status,
      noOfTokens,
      custId,
      propertyId,
      tokenPrice,
      Amount,
      Transaction_Number,
      paymentMethod,
    });

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
};

const getPropertyTxnByCustId = async (req, res) => {
  try {
    const { id } = req.params;

    const transactions = await PropertyTxn.find({ custId: id });

    if (transactions) {
      res.status(200).json(transactions);
    } else {
      res.status(404).json({ message: "No Transactions exist!!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPropertyTxn = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await PropertyTxn.find({ _id: id });

    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(404).json({ message: "No Transaction found!!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTxns = async (req, res) => {
  try {
    const { id } = req.params;

    const agg = [
      {
        $match: {
          $expr: {
            $eq: [
              "$custId",
              {
                $toObjectId: id,
              },
            ],
          },
        },
      },
      {
        $unionWith: {
          coll: "transactions",
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    "$User",
                    {
                      $toObjectId: id,
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $sort: {
          Date: -1,
        },
      },
    ];
    const client = await MongoClient.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const coll = client.db("test").collection("propertytxns");
    const cursor = coll.aggregate(agg);
    const result = await cursor.toArray();
    await client.close();

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePropTxnStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const newTransaction = await PropertyTxn.findById({ _id: id });

    const session = await mongoose.startSession();
    session.startTransaction();
    const user = await UserModel.findOne({
      _id: newTransaction.custId,
    }).session(session);
    if (!user) throw new Error("User not found");

    var tokenIds = [];
    var docs = [];
    if (
      newTransaction.Status === "Success" ||
      newTransaction.Status === "Pending"
    ) {
      for (let i = 0; i < newTransaction.noOfTokens; i++) {
        const newToken = await Token.create({
          custId,
          propertyId: newTransaction.propertyId,
          name: user.name,
          contactNumber: user.contactNumber,
          tokenPrice: newTransaction.tokenPrice,
          costPrice: newTransaction.Amount,
          Transaction_Number: newTransaction.Transaction_Number,
          paymentMethod: newTransaction.paymentMethod,
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
    var br = true;
    for (let i = 0; i < user.properties.length; i++) {
      if (user.properties[i].propertyId == newTransaction.propertyId) {
        user.properties[i].tokensBought += newTransaction.noOfTokens;
        br = false;
        break;
      }
    }
    if (br == true) {
      const prop = {
        propertyId: newTransaction.propertyId,
        tokensBought: newTransaction.noOfTokens,
      };
      user.properties.push(prop);
    }
    user.noOfTokens = user.tokens.length;
    if (
      newTransaction.Status == "Success" ||
      newTransaction.Status == "Pending"
    ) {
      await Property.findByIdAndUpdate(
        { _id: newTransaction.propertyId },
        {
          $push: {
            tokens: {
              $each: docs,
            },
          },
        }
      );

      await Property.findByIdAndUpdate({ _id: newTransaction.propertyId }, [
        {
          $set: {
            soldTokens: { $add: ["$soldTokens", newTransaction.noOfTokens] },
          },
        },
      ]);
    }

    await user.save({ session });
    await session.commitTransaction();

    const session1 = await mongoose.startSession();
    session1.startTransaction();
    const transaction = await PropertyTxn.findOne({
      _id: newTransaction._id,
    }).session(session1);
    if (transaction.Status === "Success" || transaction.Status === "Pending")
      await transaction.collection.updateOne(
        { _id: newTransaction._id },
        { $set: { tokens: tokenIds } }
      );
    await transaction.save({ session });
    await session1.commitTransaction();

    await PropertyTxn.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          Status: status,
        },
      }
    );

    const propTxn = await PropertyTxn.findById({ _id: id });

    return res.status(200).json(propTxn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTokensByTxnId = async (req, res) => {
  try {
    const { id } = req.params;

    const txn = await PropertyTxn.findById({ _id: id });

    if (txn) {
      return res.status(200).json({ tokenIds: txn.tokens });
    } else {
      res.status(404).json({ message: "Transaction not found!!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createPropertyTxn,
  getAllPropertyTxn,
  getPropertyTxnByCustId,
  getPropertyTxn,
  getAllTxns,
  updatePropTxnStatus,
  getTokensByTxnId,
};
