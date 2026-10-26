import jwt from 'jsonwebtoken';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured. Add it to backend/.env.');
  return secret;
}

/**
 * Admin authentication middleware.
 * Validates the Bearer JWT token issued at login.
 */
export function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in as an administrator.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.',
    });
  }
}

/**
 * Generate a signed JWT admin token.
 */
export function generateAdminToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '12h' });
}
