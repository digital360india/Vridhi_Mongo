import express from 'express';

import { createTransaction,  getTransactionInfoByID, getAllTransactions } from '../controllers/transaction.controller.js';

const router = express.Router();

router.route('/').post(createTransaction);
router.route('/').get(getAllTransactions);
router.route('/:id').get(getTransactionInfoByID);

export default router;