import express from 'express';

import { createProperty, updateProperty, getPropertyInfoById, getAllProperties } from '../controllers/property.controller.js';

const router = express.Router();

router.route('/').post(createProperty);
router.route('/').get(getAllProperties);
router.route('/:id').patch(updateProperty);
router.route('/:id').get(getPropertyInfoById);

export default router;