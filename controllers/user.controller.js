import User from "../mongodb/models/user.js";
import NoOfUsers from "../mongodb/models/noOfUsers.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { MongoClient } from "mongodb";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createUser = async (req, res) => {
  try {
    const { name, dob, contactNumber, gender, email } = req.body;

    const userExists = await User.findOne({ contactNumber });

    if (userExists) return res.status(200).json(userExists);
    const session = await mongoose.startSession();
    session.startTransaction();

    const numUser = await NoOfUsers.findOne({
      _id: process.env.NO_OF_USERS_OBJ_ID,
    }).session(session);

    const newUser = await User.create({
      name,
      dob,
      contactNumber,
      gender,
      email,
    });

    await numUser.collection.updateOne({}, [
      { $set: { No_Of_Users: Number.parseInt(numUser.No_Of_Users) + 1 } },
      {
        $set: {
          Current_Price: {
            $switch: {
              branches: [
                {
                  case: { $gte: ["$No_Of_Users", 301] },
                  then: { $literal: 2530 },
                },
                {
                  case: { $gte: ["$No_Of_Users", 201] },
                  then: { $literal: 2520 },
                },
                {
                  case: { $gte: ["$No_Of_Users", 101] },
                  then: { $literal: 2510 },
                },
              ],
              default: { $literal: 2500 },
            },
          },
        },
      },
    ]);

    await numUser.save({ session });
    await session.commitTransaction();

    return res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserInfoByID = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, contactNumber, gender, dob, photo } = req.body;

    const photoUrl = await cloudinary.uploader.upload(photo);

    await User.findByIdAndUpdate(
      { _id: id },
      {
        name,
        email,
        contactNumber,
        gender,
        dob,
        photo: photoUrl.url,
      }
    );

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const updateActivity = await User.findByIdAndUpdate({ _id: id }, [
      {
        $set: {
          activity: { $add: ["$activity", 1] },
        },
      },
    ]);

    return res
      .status(200)
      .json({ message: "User activity updated", user: updateActivity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEnergyDashboard = async (req, res) => {
  try {
    const agg = [
      {
        $match: {
          No_of_Units: {
            $ne: 0,
          },
        },
      },
      {
        $group: {
          _id: "dashboard",
          totalEnergyBuyers: {
            $count: {},
          },
          totalUnitsBought: {
            $sum: "$No_of_Units",
          },
          totalPayout: {
            $sum: "$Profit",
          },
          totalEnergyRevenue: {
            $sum: "$Wallet",
          },
        },
      },
    ];
    const client = await MongoClient.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const coll = client.db("test").collection("users");
    const cursor = coll.aggregate(agg);
    const result = await cursor.toArray();
    await client.close();

    return res.status(200).json({data:result});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUserByMobile = async (req, res) => {
  try {
    const { mob } = req.headers;
    console.log(mob)

    const user = await User.findOne({ contactNumber: mob });
    console.log(user);

    if(user){
      return res.status(200).json(user);
    }else{
      return res.status(404).json({ message: "User not found! Try with another mobile number." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export {
  createUser,
  getUserInfoByID,
  updateUser,
  updateUserActivity,
  getAllUsers,
  getEnergyDashboard,
  getUserByMobile
};
