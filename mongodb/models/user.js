import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, default: " " },
  email: { type: String, required: true, default: " " },
  contactNumber: { type: String, required: true },
  gender: { type: String, required: true, default: " " },
  dob: { type: String, required: true, default: " " },
  No_of_Units: { type: Number, required: true, default: 0 },
  noOfTokens: { type: Number, required: true, default: 0 },
  Profit: { type: Number, required: true, default: 0, ref: "Unit" },
  Basic: { type: Number, required: true, default: 0 },
  Wallet: { type: Number, required: true, default: 0 },
  properties: [
    {
      propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
      tokensBought: { type: Number, required: true },
    },
  ],
  Units: [{ type: mongoose.Schema.Types.ObjectId, ref: "Unit" }],
  Transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  propertyTxn: [{ type: mongoose.Schema.Types.ObjectId, ref: "PropertyTxn" }],
  activity: { type: Number, required: true, default: 0 },
  tokens: [{ type: mongoose.Schema.Types.ObjectId, ref: "Token" }],
  photo: { type: String, required: true, default: " " },
  refCodePts: { type: Number, required: true, default: 0 },
});

const userModel = mongoose.model("User", UserSchema);

export default userModel;
