# 🎮 DekNek3D — Authentication System

A production-ready, full-stack authentication system for **DekNek3D** (3D Animation & Model Generator) featuring a stunning glassmorphism UI with Three.js animated backgrounds.

---

## ✨ Features

- **JWT Authentication** — Secure login, signup, logout, and token refresh
- **3D Animated Background** — Three.js scene with floating cubes, particles, and dynamic lighting
- **Glassmorphism UI** — Frosted glass effect cards with the DekNek3D brand theme (navy, cyan, magenta)
- **Protected Dashboard** — User profile management, stats, password change
- **404 Page** — Custom branded "Page Not Found" page
- **Rate Limiting** — API abuse protection via `express-rate-limit`
- **Responsive Design** — Works across desktop and mobile

---

## 🛠️ Tech Stack

| Layer     | Technology                                      |
|-----------|--------------------------------------------------|
| Frontend  | React 18, Vite, Three.js, React Router, Axios   |
| Backend   | Node.js, Express, Mongoose, JWT, bcryptjs        |
| Database  | MongoDB Atlas                                    |
| Deploy    | Vercel (frontend) + Railway/Render (backend)     |

---

## 📂 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/authController.js   # Auth logic (register, login, logout, refresh)
│   │   ├── middleware/auth.js              # JWT verification, admin guard, error handler
│   │   ├── models/User.js                 # Mongoose user schema with bcrypt hashing
│   │   ├── routes/auth.js                 # Auth endpoints (/register, /login, /logout)
│   │   ├── routes/protected.js            # Protected endpoints (/profile, /password)
│   │   └── server.js                      # Express app setup, CORS, rate limiting
│   ├── .env.example                       # Environment template
│   ├── package.json
│   └── railway.json                       # Railway deployment config
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthPage.jsx               # Login/Signup forms with glassmorphism
│   │   │   ├── ProtectedRoute.jsx         # Route guard component
│   │   │   └── ThreeBackground.jsx        # 3D animated background (Three.js)
│   │   ├── context/AuthContext.jsx         # Global auth state management
│   │   ├── hooks/useAuth.js               # Auth hook for components
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx              # User dashboard with profile management
│   │   │   └── NotFound.jsx               # 404 page
│   │   ├── services/api.js                # Axios instance with interceptors
│   │   ├── styles/
│   │   │   ├── Auth.css                   # Auth page styles
│   │   │   ├── Dashboard.css              # Dashboard styles
│   │   │   └── globals.css                # Global design tokens & base styles
│   │   ├── App.jsx                        # Router configuration
│   │   └── main.jsx                       # App entry point
│   ├── vercel.json                        # Vercel SPA rewrite config
│   ├── vite.config.js                     # Vite config with API proxy
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment

**Backend** — create `backend/.env`:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/deknek3d-auth
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-chars
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend** — create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5001
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🌐 Deployment

### Frontend → Vercel

1. Push code to GitHub
2. Import the `frontend/` directory in [Vercel](https://vercel.com)
3. Set environment variable: `VITE_API_URL=https://your-backend-url.up.railway.app`
4. Deploy

### Backend → Railway

1. Import the `backend/` directory in [Railway](https://railway.app)
2. Set environment variables:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — your secret key
   - `FRONTEND_URL` — your Vercel frontend URL
   - `NODE_ENV=production`
3. Deploy

---

## 🔑 API Endpoints

| Method | Endpoint                    | Auth | Description           |
|--------|------------------------------|------|-----------------------|
| POST   | `/api/auth/register`         | ❌   | Create new account    |
| POST   | `/api/auth/login`            | ❌   | Login & get JWT       |
| POST   | `/api/auth/logout`           | ✅   | Logout user           |
| POST   | `/api/auth/refresh-token`    | ✅   | Refresh JWT token     |
| GET    | `/api/protected/profile`     | ✅   | Get user profile      |
| PUT    | `/api/protected/profile`     | ✅   | Update user profile   |
| PUT    | `/api/protected/change-password` | ✅ | Change password      |
| GET    | `/api/health`                | ❌   | API health check      |

---

## 🎨 Brand Theme

- **Primary**: `#0a0e27` (Deep Navy)
- **Accent Cyan**: `#00d4ff`
- **Accent Magenta**: `#ff006e`
- **Glass**: `rgba(255, 255, 255, 0.05)` with `backdrop-filter: blur(20px)`

---

## 📄 License

Built for **DekNek3D** — 3D Animation & Model Generator.
