import express from 'express';

import { createProperty, updateProperty, getPropertyInfoById, getAllProperties, getActiveBids, getPropDash, deleteProperty } from '../controllers/property.controller.js';

const router = express.Router();

router.route('/').post(createProperty);
router.route('/').get(getAllProperties);
router.route('/:id').patch(updateProperty);
router.route('/propDash').get(getPropDash);
router.route('/:id').get(getPropertyInfoById);
router.route('/activeBids/:id').get(getActiveBids);
router.route('/:id').delete(deleteProperty);

export default router;