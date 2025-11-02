# FinWise Backend

Production-ready Express + MongoDB Atlas backend for FinWise personal finance application.

## 🏗️ Architecture

- **Node.js 20+** with TypeScript
- **Express.js** with security middleware (helmet, cors, rate limiting)
- **MongoDB Atlas** with Mongoose ODM
- **JWT** authentication with refresh tokens
- **Zod** for request validation
- **bcrypt** for password hashing
- **AES-256-GCM** encryption for sensitive data

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/         # Environment and database configuration
│   ├── models/         # Mongoose schemas with indexes
│   ├── controllers/    # Request handlers
│   ├── services/       # External API integrations
│   ├── routes/         # Express routes with validation
│   ├── jobs/           # Cron jobs for price updates
│   ├── utils/          # Crypto helpers and symbol normalization
│   ├── scripts/        # Database seeding and utilities
│   ├── server.ts       # Express app configuration
│   └── index.ts        # Application bootstrap
├── .env.example        # Environment variables template
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - JWT signing secret (32+ characters)
- `JWT_REFRESH_SECRET` - Refresh token secret (32+ characters)
- `FINWISE_KMS_KEY` - 32-character encryption key for sensitive data

Optional API keys:
- `FINNHUB_TOKEN` - Stock market data
- `COVALENT_API_KEY` - Crypto wallet data
- `NEWSAPI_KEY` - Financial news
- `ZERODHA_API_KEY` & `ZERODHA_API_SECRET` - Zerodha integration

### 3. Database Setup

Seed the database with demo data:

```bash
npm run seed
```

### 4. Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 5. Production Build

```bash
npm run build
npm start
```

## 🔐 Authentication

JWT-based authentication with refresh tokens:

1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` 
3. **Refresh**: `POST /api/auth/refresh`
4. **Logout**: `POST /api/auth/logout`

Refresh tokens are stored as httpOnly cookies for security.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### User Management
- `GET /api/me` - Get user profile
- `PATCH /api/me` - Update user profile

### Account Management
- `GET /api/accounts` - List linked accounts
- `POST /api/accounts/zerodha/connect` - Zerodha OAuth
- `GET /api/accounts/zerodha/callback` - OAuth callback
- `POST /api/accounts/groww-csv` - Upload Groww CSV
- `POST /api/accounts/wallet` - Add wallet account
- `DELETE /api/accounts/:id` - Remove account

### Portfolio
- `GET /api/portfolio/summary` - Portfolio summary
- `GET /api/portfolio/holdings` - All holdings
- `POST /api/portfolio/sync/:accountId` - Sync account

### Market Data
- `GET /api/market/quote?symbol=` - Price quotes
- `GET /api/market/nav?amfiCode=` - Mutual fund NAV
- `GET /api/market/compare?symbols=&period=` - Compare assets

### Goals
- `GET /api/goals` - List goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### News
- `GET /api/news` - General financial news
- `GET /api/news?tickers=AAPL,MSFT` - Ticker-specific news
- `GET /api/news/indian-market` - Indian market news
- `GET /api/news/crypto` - Cryptocurrency news

### Admin
- `POST /api/admin/price-jobs/run` - Trigger price updates

## 🗄️ Database Models

### User
- Authentication and profile data
- KYC status, role management
- Refresh token storage

### LinkedAccount
- Broker accounts (Zerodha, Groww)
- Crypto wallets with chain support
- Encrypted credential storage

### Holding
- Asset positions across accounts
- Real-time P&L calculations
- Multi-asset support (stocks, crypto, MF)

### Transaction
- Trade history and portfolio tracking
- Support for corporate actions
- Fee and tax calculations

### Price
- Historical price data with caching
- Multi-source data aggregation
- TTL for data freshness

### Goal
- Financial goal tracking
- Progress calculations
- SIP recommendations

### Watchlist
- User-defined symbol lists
- Price alerts and notifications
- Public/private sharing

## 🔄 Services

### ZerodhaService
- OAuth 2.0 integration
- Holdings synchronization
- Token management

### GrowwCsvService  
- CSV parsing and validation
- Symbol normalization
- Bulk holdings import

### WalletService
- Multi-chain wallet support
- Covalent API integration
- Balance tracking

### PriceService
- Multi-source price aggregation
- Finnhub (stocks), CoinGecko (crypto)
- AMFI NAV data

### NewsService
- NewsAPI integration
- Ticker-specific filtering
- 2-hour caching

## ⏰ Scheduled Jobs

Daily price updates run at 6:30 PM IST (Monday-Friday):
- NSE/BSE stock prices via Finnhub
- Cryptocurrency prices via CoinGecko  
- Mutual fund NAVs via AMFI
- Automatic holdings value updates

Manual trigger available via admin endpoint.

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin protection
- **Rate limiting** - Request throttling
- **JWT** - Stateless authentication
- **bcrypt** - Password hashing (12 rounds)
- **AES-256-GCM** - Sensitive data encryption
- **Input validation** - Zod schemas
- **SQL injection prevention** - Mongoose ODM

## 🧪 Demo Data

Run `npm run seed` to create:
- Demo user: `demo@finwise.com` / `password123`
- Sample Zerodha and wallet accounts
- Holdings in RELIANCE stock and Ethereum
- Current price data

## 📈 Performance

- **MongoDB indexes** on frequent queries
- **Price data caching** with TTL
- **News caching** (2 hours)
- **Connection pooling** via Mongoose
- **Rate limiting** to prevent abuse

## 🚀 Deployment

1. Set production environment variables
2. Build the application: `npm run build`
3. Start with process manager: `pm2 start dist/index.js`
4. Configure reverse proxy (nginx)
5. Set up SSL certificates
6. Configure MongoDB Atlas network access

## 🔧 Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **ts-node-dev** - Development server
- **TypeScript** - Type safety
- **Zod** - Runtime validation

## 📋 TODO Items

Current implementation includes:
- ✅ Complete authentication system
- ✅ Database models with indexes
- ✅ Service layer architecture
- ✅ News API integration (working)
- ✅ Cron job system
- ✅ Security middleware

Remaining implementations:
- [ ] Complete Zerodha OAuth flow
- [ ] Groww CSV upload endpoint
- [ ] Wallet balance synchronization
- [ ] Portfolio analytics calculations
- [ ] Goal progress tracking
- [ ] JWT middleware for protected routes
- [ ] Admin role authorization
- [ ] Email verification system
- [ ] Push notifications
- [ ] API rate limiting per user

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use Prettier for formatting
3. Add proper error handling
4. Include unit tests for new features
5. Update documentation

## 📄 License

MIT License - see LICENSE file for details.