import express from 'express';

import { createPropertyTxn, getAllPropertyTxn, getPropertyTxnByCustId, getPropertyTxn, getAllTxns, updatePropTxnStatus } from '../controllers/propertyTxn.controller.js';

const router = express.Router();

router.route('/').post(createPropertyTxn);
router.route('/').get(getAllPropertyTxn);
router.route('/custId/:id').get(getPropertyTxnByCustId);
router.route('/propertyTxn/:id').get(getPropertyTxn);
router.route('/allTxns/:id').get(getAllTxns);
router.route('/status/:id').patch(updatePropTxnStatus);

export default router;