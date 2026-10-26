import bcrypt from 'bcryptjs';
import { generateAdminToken } from '../middleware/adminAuth.js';

// ─── Admin Credentials (stored in env for production) ────────────────────────
// Credentials must be supplied through environment variables.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || '';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const ADMIN_PASSWORD_PLAIN = process.env.NODE_ENV === 'production' ? '' : (process.env.ADMIN_PASSWORD || '');

/**
 * @desc  Admin login — returns a JWT on success
 * @route POST /api/admin/login
 */
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  if (!ADMIN_USERNAME || (!ADMIN_PASSWORD_HASH && !ADMIN_PASSWORD_PLAIN)) {
    return res.status(503).json({ success: false, message: 'Administrator login is not configured on the server.' });
  }

  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  let isValid = false;
  if (ADMIN_PASSWORD_HASH) {
    isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  } else {
    // Fallback: plain-text comparison (development only — use hashed in production)
    isValid = password === ADMIN_PASSWORD_PLAIN;
  }

  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const token = generateAdminToken({ username, role: 'admin' });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    expiresIn: '12h',
  });
};

/**
 * @desc  Verify admin session is still valid
 * @route GET /api/admin/verify
 */
export const verifyAdmin = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Session valid',
    admin: req.admin,
  });
};
