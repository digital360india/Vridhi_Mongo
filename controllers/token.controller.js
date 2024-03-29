import Token from "../mongodb/models/token.js";
import User from "../mongodb/models/user.js";
import Property from "../mongodb/models/property.js";

const allotPropToToken = async (req, res) => {
    try {
        const { tokenId } = req.params;

        const token = await Token.findById({ _id: tokenId });

        if(token){
            const winner = User.findById({ _id: token.custId});
            await Property.findByIdAndUpdate({ _id: token.propertyId},[
                {
                    $set: { Status: "Alloted"}
                },
                {
                    $set: { winner: {
                        custId: token.custId,
                        image: winner.photo
                    }
                }
                }
            ]);
            res.status(200).json(winner);
        }else{
            res.status(404).json({ message: "Incorrect Token ID"});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });  
    }
}

const getAllTokens = async (req, res) => {
    try {
        const tokens = await Token.find({});

        return res.status(200).json(tokens);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { allotPropToToken, getAllTokens };