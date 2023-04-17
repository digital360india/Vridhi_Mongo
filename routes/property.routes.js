import express from 'express';

import { createProperty, updateProperty, getPropertyInfoById, getAllProperties, getActiveBids } from '../controllers/property.controller.js';

const router = express.Router();

router.route('/').post(createProperty);
router.route('/').get(getAllProperties);
router.route('/:id').patch(updateProperty);
router.route('/:id').get(getPropertyInfoById);
router.route('/activeBids/:id').get(getActiveBids);

export default router;