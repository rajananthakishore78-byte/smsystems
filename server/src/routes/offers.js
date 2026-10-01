import express from 'express';
import {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer
} from '../controllers/offerController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getOffers);
router.post('/', requireAdmin, createOffer);
router.put('/:id', requireAdmin, updateOffer);
router.delete('/:id', requireAdmin, deleteOffer);

export default router;
