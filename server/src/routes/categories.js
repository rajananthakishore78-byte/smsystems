import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes for visitors (homepage grid + product filters)
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Protected routes for showroom admin
router.post('/', requireAdmin, createCategory);
router.put('/:id', requireAdmin, updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);

export default router;
