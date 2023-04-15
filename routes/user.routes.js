import express from 'express';

import { createUser,  getUserInfoByID, updateUser, updateUserActivity } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/').post(createUser);
router.route('/:id').get(getUserInfoByID);
router.route('/:id').patch(updateUser);
router.route('/activity/:id').patch(updateUserActivity);

export default router;