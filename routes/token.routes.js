import express from 'express';

import { allotPropToToken } from '../controllers/token.controller.js';

const router = express.Router();

router.route('/:tokenId').get(allotPropToToken);

export default router;