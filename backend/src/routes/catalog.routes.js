import express from 'express';
import {
  getCategories,
  getProducts,
  getProductById,
  seedDatabase,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/catalog.controller.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// ── Public read routes ──────────────────────────────────────────────────────
router.get('/', getCategories);
router.get('/categories', getCategories);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

// ── Admin-only routes (require JWT) ─────────────────────────────────────────
router.post('/seed', adminAuth, seedDatabase);          // Protect seed in production
router.post('/products', adminAuth, createProduct);
router.put('/products/:id', adminAuth, updateProduct);
router.delete('/products/:id', adminAuth, deleteProduct);

export default router;