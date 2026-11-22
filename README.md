# Wafewarcha Chai - Centralized Franchise Repository (MERN)

A centralized web-based repository that organizes and manages **brand information, franchise opportunities, investment details, operating costs, products and the franchise process**, so entrepreneurs and administrators can access, update and manage everything in one place.

**Stack:** React 18 + Vite + React Router + Axios + Recharts · Node.js + Express · MongoDB Atlas + Mongoose · JWT + bcrypt · Render (API) · Vercel (frontend) · GitHub

> All franchise prices, investment/operating figures, testimonials and contact details are **clearly labelled sample/illustrative data**, editable from the admin panel.

## Features
- **Public site:** Home, About, Franchise Opportunities, Investment, Operating Costs, Menu (search + category filter), Franchise Process, Gallery (lightbox), Contact (saved to MongoDB), Register / Login
- **Entrepreneur dashboard:** profile, quick links, enquiry form (validation, unique reference no. `WC-YYYYMMDD-XXXXXX`, status *Pending*), **My Enquiries** (own enquiries only, live status)
- **Admin panel (separate login):** Dashboard with stats + pie/bar charts; full CRUD for brand info, franchise models, investments, operating costs, products, process steps, gallery; registered entrepreneurs; enquiry management (search, status filter, details, status change, internal note); contact messages
- **Security:** bcrypt hashing (bcryptjs, cost 12), JWT, role-based middleware (`protect`, `adminOnly`), role never accepted from client at registration, server-side validation, CORS allow-list, env-based secrets, admin created via seed script only

## Folder structure
```
wafewarcha-chai/
├── backend/   config/ controllers/ models/ routes/ middleware/ utils/ scripts/seed.js server.js
└── frontend/  src/{components,pages,layouts,context,services,hooks,assets} App.jsx main.jsx
```

## API overview
| Route | Access |
|---|---|
| `GET /api/health` | public |
| `POST /api/auth/register · /login · /admin-login`, `GET /api/auth/me` | public / token |
| `/api/brand` | GET public, PUT admin |
| `/api/franchises · investments · costs · products · process · gallery` | GET public, POST/PUT/DELETE admin |
| `POST /api/enquiries`, `GET /api/enquiries/mine` | entrepreneur |
| `GET/PUT/DELETE /api/enquiries[/:id]` | admin |
| `POST /api/contact` (public), `GET/DELETE /api/contact` (admin) | mixed |
| `/api/users`, `/api/admin/dashboard` | admin |

## Run locally
```bash
# 1. Backend
cd backend && cp .env.example .env     # fill MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run seed                           # creates the admin + sample data
npm run dev                            # http://localhost:5000/api/health

# 2. Frontend (new terminal)
cd frontend && cp .env.example .env    # VITE_API_URL=http://localhost:5000/api
npm install && npm run dev             # http://localhost:5173
```
Admin login: `http://localhost:5173/admin/login` (credentials = `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `backend/.env`).

## Deployment

### A. MongoDB Atlas
1. Sign up at mongodb.com/atlas → **Create** a free **M0** cluster.
2. **Database Access → Add Database User** (username + strong password, role *Read and write to any database*).
3. **Network Access → Add IP Address**. Render's free tier has no fixed IP, so use `0.0.0.0/0` (allow from anywhere) - safe only because the DB user has a strong password. Never commit credentials.
4. **Connect → Drivers** → copy the string and add your DB name:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/wafewarcha-chai?retryWrites=true&w=majority`
   (URL-encode special characters in the password.)

### B. GitHub
1. Create an empty repo on github.com (e.g. `wafewarcha-chai`), no README.
2. In the project root:
```bash
git init
git add .
git commit -m "Initial commit: Wafewarcha Chai MERN project"
git branch -M main
git remote add origin https://github.com/<your-username>/wafewarcha-chai.git
git push -u origin main
```
`.gitignore` files already keep `.env` and `node_modules` out of the repo.

### C. Render (backend)
1. render.com → **New + → Web Service** → connect GitHub → select the repo.
2. **Root Directory:** `backend` · **Runtime:** Node · **Build Command:** `npm install` · **Start Command:** `npm start`
3. **Environment variables:** `MONGO_URI`, `JWT_SECRET` (long random string), `CLIENT_URL` (your Vercel URL, no trailing slash; comma-separate multiple), `NODE_ENV=production`. (`PORT` is injected by Render - not needed.)
4. Set **Health Check Path** to `/api/health`. Deploy and open `https://<service>.onrender.com/api/health` → `{"status":"ok"}`.
5. Create the admin + sample data once: Render dashboard → service → **Shell** → `npm run seed` (add `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars first). Alternatively run `npm run seed` locally with the Atlas `MONGO_URI` in `backend/.env`.
> Free Render services sleep after inactivity; the first request may take ~30-60 s.

### D. Vercel (frontend)
1. vercel.com → **Add New → Project** → import the GitHub repo.
2. **Root Directory:** `frontend` · Framework: Vite (build `npm run build`, output `dist`).
3. **Environment variable:** `VITE_API_URL = https://<service>.onrender.com/api`
4. Deploy. `frontend/vercel.json` already contains the React Router rewrite (deep links / refresh work).
5. Copy the Vercel URL into Render's `CLIENT_URL` and redeploy the backend (CORS).

### E. Automatic deployment
Render and Vercel both watch the `main` branch. After any change: `git add . && git commit -m "message" && git push` → both platforms rebuild and redeploy automatically (a few minutes). Environment variable changes require a redeploy (Vercel) or auto-restart (Render).

## Test checklist
Register → login → submit enquiry (note reference no.) → admin login → *Franchise Enquiries* → change status + note → entrepreneur *My Enquiries* shows new status (note stays private) → refresh: data persists → try opening `/admin` as entrepreneur (redirected; API returns 403) → add/edit/delete a product and check the Menu page.

## Notes for the viewer / demo
- Images use Unsplash URLs with an automatic ☕ fallback if one ever fails to load; replace any from *Manage Products / Gallery*.
- Only the JWT is kept in `localStorage`; all business data lives in MongoDB.

## Troubleshooting (Windows / VS Code)
| Problem | Fix |
|---|---|
| Blank white page | Open http://localhost:5173 in Chrome/Edge, press F12 → Console, read the first red error. An error screen now appears instead of a blank page. |
| `ERR_CONNECTION_REFUSED :5000` | Backend is not running. `cd backend` → `npm run dev`. |
| `querySrv ENOTFOUND` / `EBADNAME` | `MONGO_URI` in **backend/.env** has a wrong cluster address or placeholders. Copy the real string from Atlas → Connect → Drivers. |
| `bad auth` | Database user/password wrong (this is the *database user*, not your Atlas login). Reset it in Atlas → Database & Network Access. |
| `ETIMEDOUT` | Atlas → Network Access → add `0.0.0.0/0`. |
| `.env` changes ignored | Stop the server (Ctrl+C) and run it again. `.env` must be in `backend/` and named exactly `.env`. |
| Changed `VITE_API_URL` | Restart `npm run dev` (local) or Redeploy (Vercel). |

Run order: Atlas setup → `backend/.env` → `cd backend && npm install && npm run seed && npm run dev` → `cd frontend && npm install && npm run dev`.
