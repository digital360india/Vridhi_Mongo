import express from 'express';

import { createUnit,  getUnitInfoByID, updateUnit } from '../controllers/unit.controller.js';

const router = express.Router();

router.route('/').post(createUnit);
router.route('/:id').get(getUnitInfoByID);
router.route('/:id').patch(updateUnit);

export default router;