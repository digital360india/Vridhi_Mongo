import express from 'express';

import { createReferralCode, getAllReferralCodes, getRefCodeInfoById, updateRefCode } from '../controllers/referralCode.controller.js';

const router = express.Router();

router.route('/').post(createReferralCode);
router.route('/:id').patch(updateRefCode);
router.route('/:id').get(getRefCodeInfoById);
router.route('/').get(getAllReferralCodes);

export default router;