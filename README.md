# Zhele Bakes & Bites

Responsive bakery e-commerce application built with React + Vite, Express, MongoDB, and Socket.IO.

## Requirements

- Node.js 22 LTS (or a version supported by the installed Vite release)
- npm
- MongoDB local instance or a MongoDB connection string

## 1. Configure the backend

```bash
cd backend
npm ci
```

Copy `backend/.env.example` to `backend/.env` and set:

- `MONGODB_URI`
- `CLIENT_URL`
- `JWT_SECRET` to a unique, long random value
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD` for local development, or `ADMIN_PASSWORD_HASH` for production

Never commit `backend/.env`. In production, use a bcrypt hash for `ADMIN_PASSWORD_HASH`; do not use a plain-text administrator password.

Start the API:

```bash
npm run dev
```

Health check: `http://localhost:5000/api/health`

If port 5000 is already in use, identify the existing process before stopping it, or set `PORT` to another free port and update the frontend API URL.

## 2. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm ci
```

Copy `frontend/.env.example` to `frontend/.env`. Set `VITE_API_URL` to the backend base URL. Configure `VITE_BUSINESS_PHONE`, `VITE_WHATSAPP_NUMBER`, and `VITE_BUSINESS_EMAIL` with the bakery's real contact details before launch.

Start the frontend:

```bash
npm run dev
```

Open the Vite URL printed in the terminal, usually `http://localhost:5173`.

## Available routes

- `/` — home
- `/shop` — product catalogue
- `/product/:id` — product details
- `/checkout` — checkout
- `/order-confirmation/:id` — order confirmation
- `/track` — order tracking
- `/about` — about the bakery
- `/contact` — contact page
- `/admin` — staff/admin portal

## Current project status and important limitations

- Product and order prices are recalculated by the backend during order creation.
- Delivery costs KSh 100 for orders below KSh 1,500 and is free at or above KSh 1,500; pickup has no delivery fee.
- Order references use random identifiers, and Socket.IO status updates are scoped to the relevant order room. Admin socket updates require a valid administrator JWT.
- Cash on delivery/pickup is the currently available checkout method.
- M-Pesa STK Push and card payments are **not integrated**. They are shown as unavailable in checkout; no payment should be described as completed until a payment provider is integrated and its callback is verified.
- Contact links are hidden until real business contact values are configured. The contact form opens a pre-filled email draft when `VITE_BUSINESS_EMAIL` is configured; the customer must send that email.
- Newsletter signup is a placeholder and does not store subscribers.
- A full end-to-end test with a running MongoDB instance and real environment configuration is still required before production deployment.

## Security notes

- Never commit `.env` files, `node_modules`, or generated secrets.
- Use a strong unique `JWT_SECRET` and a bcrypt admin password hash in production.
- Keep MongoDB network access restricted and enable backups.
- Use HTTPS in production.
- The database seed endpoint is disabled in production.
