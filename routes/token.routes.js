import express from 'express';

import { allotPropToToken, getAllTokens } from '../controllers/token.controller.js';

const router = express.Router();

router.route('/allTokens').get(getAllTokens);
router.route('/:tokenId').get(allotPropToToken);

export default router;