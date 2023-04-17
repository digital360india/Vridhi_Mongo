import mongoose from "mongoose";

const ReferralCodeSchema = new mongoose.Schema({
  custId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  refCode: { type: String, required: true, default: " " },
  noOfUsers: { type: Number, required: true, default: 0 },
  claimed: { type: Number, required: true, default: 0 },
});

const referralCodeModel = mongoose.model("ReferralCode", ReferralCodeSchema);

export default referralCodeModel;
