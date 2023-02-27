import NoOfUsers from '../mongodb/models/noOfUsers.js';
import * as dotenv from "dotenv";

dotenv.config();

const getCurrentPrice = async (req, res) => {
    try {
        const numUser = await NoOfUsers.findOne({
            _id: process.env.NO_OF_USERS_OBJ_ID,
          })

        res.status(200).json(numUser.Current_Price);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getCurrentPrice
};