import express from 'express';

import { createUser,  getUserInfoByID, updateUser, updateUserActivity, getAllUsers, getEnergyDashboard, getUserByMobile } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/').post(createUser);
router.route('/').get(getAllUsers);
router.route('/getEnergyDashboard').get(getEnergyDashboard);
router.route('/mobile').get(getUserByMobile);
router.route('/:id').get(getUserInfoByID);
router.route('/:id').patch(updateUser);
router.route('/activity/:id').patch(updateUserActivity);

export default router;