import express from 'express';

import { getCurrentPrice } from '../controllers/noOfUsers.controller.js';

const router = express.Router();

router.route('/').get(getCurrentPrice);

export default router;