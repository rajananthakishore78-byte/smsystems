import express from 'express';
import { upload } from '../middleware/upload.js';
import { uploadImage } from '../controllers/uploadController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Upload image (protected by admin authentication)
router.post('/', requireAdmin, upload.single('image'), uploadImage);

export default router;
