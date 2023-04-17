import express from "express";

import {
  createReferralCode,
  getAllReferralCodes,
  getRefCodeInfoById,
  updateRefCode,
  isRefCodeValid,
} from "../controllers/referralCode.controller.js";

const router = express.Router();

router.route("/").post(createReferralCode);
router.route("/").get(getAllReferralCodes);
router.route("/:id").patch(updateRefCode);
router.route("/:id").get(getRefCodeInfoById);
router.route("/code/:refCode").get(isRefCodeValid);

export default router;
