import express from 'express';
import {
  getInquiries,
  createInquiry,
  updateInquiryStatus
} from '../controllers/inquiryController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public: customer submits quote or inspection request
router.post('/', createInquiry);

// Protected: showroom admin reviews inquiries
router.get('/', requireAdmin, getInquiries);
router.patch('/:id/status', requireAdmin, updateInquiryStatus);

export default router;
