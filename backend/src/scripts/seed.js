import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { User, LinkedAccount, Holding, Price } from '../models/index.js';
import { hashPassword } from '../utils/crypto.js';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await LinkedAccount.deleteMany({});
    await Holding.deleteMany({});
    await Price.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create demo user
    const hashedPassword = await hashPassword('password123');
    const user = await User.create({
      email: 'demo@finwise.com',
      password: hashedPassword,
      name: 'Demo User',
      phone: '+919876543210',
      kycStatus: 'approved',
      isEmailVerified: true,
    });
    console.log('👤 Created demo user:', user.email);

    // Create wallet account
    const walletAccount = await LinkedAccount.create({
      userId: user._id,
      type: 'wallet',
      provider: 'metamask',
      accountId: '0x742d35Cc6634C0532925a3b8D2aF2c5f94A4b123',
      accountName: 'My MetaMask Wallet',
      walletAddress: '0x742d35Cc6634C0532925a3b8D2aF2c5f94A4b123',
      chainId: 'ethereum',
      isActive: true,
      syncStatus: 'success',
      lastSyncAt: new Date(),
    });
    console.log('💳 Created wallet account:', walletAccount.accountName);

    // Create Zerodha account (placeholder)
    const zerodhaAccount = await LinkedAccount.create({
      userId: user._id,
      type: 'zerodha',
      provider: 'zerodha',
      accountId: 'DEMO123456',
      accountName: 'My Zerodha Account',
      isActive: true,
      syncStatus: 'success',
      lastSyncAt: new Date(),
    });
    console.log('📈 Created Zerodha account:', zerodhaAccount.accountName);

    // Create sample holdings
    const holdings = [
      // Stocks
      {
        userId: user._id,
        accountId: zerodhaAccount._id,
        symbol: 'RELIANCE',
        originalSymbol: 'RELIANCE',
        exchange: 'NSE',
        assetType: 'stock',
        quantity: 50,
        avgPrice: 2450.75,
        totalInvested: 50 * 2450.75,
        currentPrice: 2500.00,
        marketValue: 125000,
        pnl: 2462.50,
        pnlPercent: 2.01,
        lastUpdated: new Date(),
      },
      {
        userId: user._id,
        accountId: zerodhaAccount._id,
        symbol: 'TCS',
        originalSymbol: 'TCS',
        exchange: 'NSE',
        assetType: 'stock',
        quantity: 25,
        avgPrice: 3200.00,
        totalInvested: 25 * 3200.00,
        currentPrice: 3350.25,
        marketValue: 83756.25,
        pnl: 3756.25,
        pnlPercent: 4.69,
        lastUpdated: new Date(),
      },
      {
        userId: user._id,
        accountId: zerodhaAccount._id,
        symbol: 'INFY',
        originalSymbol: 'INFY',
        exchange: 'NSE',
        assetType: 'stock',
        quantity: 30,
        avgPrice: 1450.50,
        totalInvested: 30 * 1450.50,
        currentPrice: 1420.75,
        marketValue: 42622.50,
        pnl: -892.50,
        pnlPercent: -2.05,
        lastUpdated: new Date(),
      },
      // Crypto
      {
        userId: user._id,
        accountId: walletAccount._id,
        symbol: 'BTC',
        originalSymbol: 'BTC',
        exchange: 'CRYPTO',
        assetType: 'crypto',
        quantity: 0.5,
        avgPrice: 42000.00,
        totalInvested: 0.5 * 42000.00,
        currentPrice: 45000.00,
        marketValue: 22500.00,
        pnl: 1500.00,
        pnlPercent: 7.14,
        lastUpdated: new Date(),
      },
      {
        userId: user._id,
        accountId: walletAccount._id,
        symbol: 'ETH',
        originalSymbol: 'ETH',
        exchange: 'CRYPTO',
        assetType: 'crypto',
        quantity: 2.5,
        avgPrice: 2800.00,
        totalInvested: 2.5 * 2800.00,
        currentPrice: 3100.00,
        marketValue: 7750.00,
        pnl: 750.00,
        pnlPercent: 10.71,
        lastUpdated: new Date(),
      },
    ];

    await Holding.insertMany(holdings);
    console.log(`📊 Created ${holdings.length} sample holdings`);

    // Create sample price data
    const prices = [
      {
        symbol: 'RELIANCE',
        exchange: 'NSE',
        assetType: 'stock',
        price: 2500.00,
        open: 2480.00,
        high: 2520.00,
        low: 2475.00,
        change: 19.25,
        changePercent: 0.77,
        volume: 2500000,
        timestamp: new Date(),
        source: 'finnhub',
      },
      {
        symbol: 'TCS',
        exchange: 'NSE',
        assetType: 'stock',
        price: 3350.25,
        open: 3320.00,
        high: 3365.00,
        low: 3315.00,
        change: 30.25,
        changePercent: 0.91,
        volume: 1800000,
        timestamp: new Date(),
        source: 'finnhub',
      },
      {
        symbol: 'BTC',
        exchange: 'CRYPTO',
        assetType: 'crypto',
        price: 45000.00,
        open: 44500.00,
        high: 45200.00,
        low: 44300.00,
        change: 500.00,
        changePercent: 1.12,
        volume: 25000000000,
        timestamp: new Date(),
        source: 'coingecko',
      },
    ];

    await Price.insertMany(prices);
    console.log(`💹 Created ${prices.length} sample price records`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('📝 Demo credentials: demo@finwise.com / password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('📤 Database connection closed');
  }
}

// Run the seed function
seed();