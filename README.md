# FinWise

FinWise is a personal finance web application that helps users discover their financial risk profile, plan goal-based investments (SIP/one-time), and visualize projected returns. It combines market data, a simple risk scoring engine, and interactive charts to help users make data-driven financial decisions.

## Table of contents

- Features
- Tech stack
- Quick start
	- Backend
	- Frontend
- Environment variables
- Scripts
- Seeding demo data
- Deployment notes
- Contributing

## Features

- Risk questionnaire and automated profile (Conservative / Balanced / Aggressive)
- Goal-based projections: monthly SIP, projected corpus, expected returns
- Market data: mutual funds, crypto, stocks (cached with cron jobs)
- Interactive visualizations for allocations and projections
- CRUD operations for users, goals, and watchlists
- Curated finance news feed

## Tech stack

- Frontend: React (Vite) + TypeScript
- Styling: Tailwind CSS
- Charts: Recharts
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT (and optional Passport Google OAuth)
- Jobs: node-cron for scheduled updates

## Quick start

Prerequisites

- Node.js (16+ recommended)
- npm (or yarn)
- MongoDB (Atlas or local)

Install dependencies

```powershell
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

Run locally

```powershell
# Start the backend (development)
cd backend
npm run dev

# Start the frontend (development)
cd ../frontend
npm run dev
```

The backend usually runs on the port configured in the code (commonly 5001). The frontend uses Vite (commonly 5173). Check console logs for exact URLs.

## Environment variables

Create a `.env` file in `backend/` with these common variables (adjust names as needed to match your config):

- MONGODB_URI — MongoDB connection string
- JWT_SECRET — secret used to sign JWT tokens
- ALPHAVANTAGE_KEY — (optional) AlphaVantage API key for stock data
- COINGECKO_KEY — (optional) CoinGecko API key for crypto

If a `backend/config` or `.env.example` file exists, copy it and fill in real values. I attempted to read `backend/config/env.js` but it was missing in the repository; ensure your env config matches the implementation in `backend/src/config`.

## Scripts (backend)

Key scripts from `backend/package.json`:

- `npm run dev` — start backend with nodemon (dev)
- `npm start` — run backend in production mode
- `npm run seed` — run seed script to populate demo data
- `npm run lint` / `npm run lint:fix` / `npm run format` — code quality tools

## Seeding demo data

To populate demo/test data, run:

```powershell
cd backend
npm run seed
```

## API (selected endpoints)

- POST /api/auth/register — register new user
- POST /api/auth/login — login and get JWT
- POST /api/questionnaire — submit risk answers and compute profile
- POST /api/simulation — create a goal simulation
- GET /api/market/mf — mutual fund NAVs (cached)
- GET /api/market/crypto — crypto prices
- GET /api/news — curated headlines

Review `backend/src/routes` for full endpoint details and payloads.

## Deployment notes

- Frontend: build and deploy to Vercel/Netlify or any static host supporting Vite
- Backend: deploy to Render, Railway, or any Node-compatible host; remember to set env vars
- Use MongoDB Atlas for production with proper credentials and network rules

## Contributing

Contributions are welcome. Suggested flow:

1. Fork the repo
2. Create a feature branch
3. Run linters and tests locally
4. Open a PR with a clear description and relevant screenshots

Follow the project's coding style (Prettier + ESLint).

## License

MIT — see LICENSE (if present)

## Contact / Repo

https://github.com/Shreyash-Thakur/Finwise

---

If you'd like, I can also:

- Add `backend/.env.example` with the required variables
- Add an npm script or a small shell script to start frontend and backend concurrently for local development

If you want changes or a shorter one-page README focused only on deployment, tell me which sections to keep.