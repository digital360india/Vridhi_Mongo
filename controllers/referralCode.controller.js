import ReferralCode from "../mongodb/models/referralCode.js";

const createReferralCode = async (req, res) => {
  try {
    const { custId, refCode, noOfUsers } = req.body;

    const newRefCode = await ReferralCode.create({
      custId,
      refCode,
      noOfUsers,
    });

    return res.status(200).json(newRefCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReferralCodes = async (req, res) => {
  try {
    const refCodes = await ReferralCode.find();

    return res.status(200).json(refCodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRefCodeInfoById = async (req, res) => {
  try {
    const { id } = req.params;

    const refCode = await ReferralCode.findById({ _id: id });

    if (refCode) {
      return res.status(200).json(refCode);
    } else {
      return res.status(404).json({ message: "ReferralCode not found!!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRefCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { custId, refCode, noOfUsers } = req.body;

    const referralCode = await ReferralCode.findById({ _id: id });

    if (referralCode) {
      const updatedRefCode = await ReferralCode.findByIdAndUpdate(
        { _id: id },
        { custId, refCode, noOfUsers }
      );

      return res.status(200).json(updatedRefCode);
    } else {
      return res.status(404).json({ message: "Referral Code not found!!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createReferralCode, getAllReferralCodes, getRefCodeInfoById, updateRefCode };
