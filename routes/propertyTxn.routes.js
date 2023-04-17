import express from 'express';

import { createPropertyTxn, getAllPropertyTxn, getPropertyTxnByCustId } from '../controllers/propertyTxn.controller.js';

const router = express.Router();

router.route('/').post(createPropertyTxn);
router.route('/').get(getAllPropertyTxn);
router.route('/custId/:id').get(getPropertyTxnByCustId);

export default router;