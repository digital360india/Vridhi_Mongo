import express from 'express';

import { createPropertyTxn, getAllPropertyTxn } from '../controllers/propertyTxn.controller.js';

const router = express.Router();

router.route('/').post(createPropertyTxn);
router.route('/').get(getAllPropertyTxn)

export default router;