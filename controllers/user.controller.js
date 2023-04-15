import User from "../mongodb/models/user.js";
import NoOfUsers from "../mongodb/models/noOfUsers.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

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
    const { name, email, contactNumber, gender, dob } = req.body;

    await User.findByIdAndUpdate(
      { _id: id },
      {
        name,
        email,
        contactNumber,
        gender,
        dob,
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

    const updateActivity = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          activity: activity + 1,
        },
      }
    );

    return res
      .status(200)
      .json({ message: "User activity updated", user: updateActivity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createUser, getUserInfoByID, updateUser, updateUserActivity };
