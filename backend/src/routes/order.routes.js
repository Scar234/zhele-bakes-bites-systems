import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus } from '../controllers/order.controller.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// Public — anyone can place an order or track by order number
router.post('/', createOrder);
router.get('/:id', getOrderById);

// Admin-only — require JWT
router.get('/', adminAuth, getOrders);
router.patch('/:id/status', adminAuth, updateOrderStatus);

export default router;