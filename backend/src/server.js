import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Order from './models/Order.js';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required. Add a strong random value to backend/.env.');
}
if (!process.env.ADMIN_USERNAME || (process.env.NODE_ENV === 'production' ? !process.env.ADMIN_PASSWORD_HASH : (!process.env.ADMIN_PASSWORD_HASH && !process.env.ADMIN_PASSWORD))) {
  throw new Error('Configure ADMIN_USERNAME and either ADMIN_PASSWORD_HASH or ADMIN_PASSWORD in backend/.env.');
}

await connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Attach socket server instance to Express app
app.set('io', io);

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role === 'admin') socket.data.isAdmin = true;
  } catch {
    // A bad optional token does not grant admin access.
  }
  next();
});

io.on('connection', (socket) => {
  if (socket.data.isAdmin) socket.join('admins');

  socket.on('track:subscribe', async ({ orderNumber } = {}) => {
    if (typeof orderNumber !== 'string') return;
    const safeOrderNumber = orderNumber.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (!/^ZHL-[A-F0-9]{16}$/.test(safeOrderNumber)) return;
    try {
      const order = await Order.findOne({ orderNumber: safeOrderNumber }).select('_id');
      if (order) socket.join(`order:${order._id}`);
    } catch (error) {
      console.error('[Socket tracking subscription]', error.message);
    }
  });

  console.log(`Socket client connected: ${socket.id}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other server process or set PORT to another available port.`);
    process.exitCode = 1;
    return;
  }
  console.error('[HTTP server error]', error.message);
  process.exitCode = 1;
});

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});