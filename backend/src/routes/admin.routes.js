import express from 'express';
import { adminLogin, verifyAdmin } from '../controllers/admin.controller.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// POST /api/admin/login
router.post('/login', adminLogin);

// GET /api/admin/verify — protected
router.get('/verify', adminAuth, verifyAdmin);

export default router;
