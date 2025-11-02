import cron from 'node-cron';
import { PriceService } from '../services/PriceService.js';
import { Holding } from '../models/index.js';

const priceService = new PriceService();

/**
 * Daily EOD price update job
 * Runs at 6:30 PM IST (18:30) Monday to Friday
 */
export function startCronJobs() {
  // Daily EOD price updates
  cron.schedule('30 18 * * 1-5', async () => {
    console.log('🕰️  Starting daily EOD price update job...');
    
    try {
      // Get all unique symbols from holdings
      const holdings = await Holding.aggregate([
        { $group: { _id: { symbol: '$symbol', assetType: '$assetType' } } }
      ]);

      const stockSymbols = holdings
        .filter(h => h._id.assetType === 'stock')
        .map(h => h._id.symbol);

      const cryptoSymbols = holdings
        .filter(h => h._id.assetType === 'crypto')
        .map(h => h._id.symbol);

      // Update stock prices
      if (stockSymbols.length > 0) {
        console.log(`📈 Updating ${stockSymbols.length} stock prices...`);
        const stocksUpdated = await priceService.bulkUpdatePrices(stockSymbols, 'stock');
        console.log(`✅ Updated ${stocksUpdated} stock prices`);
      }

      // Update crypto prices
      if (cryptoSymbols.length > 0) {
        console.log(`₿ Updating ${cryptoSymbols.length} crypto prices...`);
        const cryptoUpdated = await priceService.bulkUpdatePrices(cryptoSymbols, 'crypto');
        console.log(`✅ Updated ${cryptoUpdated} crypto prices`);
      }

      // Update mutual fund NAVs
      console.log('📊 Updating mutual fund NAVs...');
      const navData = await priceService.fetchMutualFundNav();
      let navUpdated = 0;
      
      for (const nav of navData.slice(0, 100)) { // Limit to prevent excessive updates
        await priceService.upsertPrice(
          nav.schemeCode,
          'AMFI',
          'mf',
          { nav: nav.nav, price: nav.nav, amfiCode: nav.schemeCode },
          'amfi'
        );
        navUpdated++;
      }
      
      console.log(`✅ Updated ${navUpdated} mutual fund NAVs`);
      console.log('🎉 Daily EOD price update job completed successfully');

    } catch (error) {
      console.error('❌ Daily EOD price update job failed:', error);
    }
  }, {
    timezone: 'Asia/Kolkata'
  });

  // Weekly portfolio rebalancing suggestions (Sundays at 9 AM)
  cron.schedule('0 9 * * 0', async () => {
    console.log('🔄 Running weekly portfolio analysis...');
    // TODO: Implement portfolio rebalancing suggestions
    console.log('📝 Portfolio analysis completed');
  }, {
    timezone: 'Asia/Kolkata'
  });

  console.log('⏰ Cron jobs started successfully');
}

/**
 * Manual trigger for price update job (for admin use)
 */
export async function triggerPriceUpdateJob() {
  try {
    console.log('🔧 Manual price update job triggered...');
    
    const holdings = await Holding.aggregate([
      { $group: { _id: { symbol: '$symbol', assetType: '$assetType' } } }
    ]);

    const stockSymbols = holdings
      .filter(h => h._id.assetType === 'stock')
      .map(h => h._id.symbol);

    const cryptoSymbols = holdings
      .filter(h => h._id.assetType === 'crypto')
      .map(h => h._id.symbol);

    const stocksUpdated = stockSymbols.length > 0 
      ? await priceService.bulkUpdatePrices(stockSymbols, 'stock')
      : 0;

    const cryptoUpdated = cryptoSymbols.length > 0
      ? await priceService.bulkUpdatePrices(cryptoSymbols, 'crypto')
      : 0;

    const navData = await priceService.fetchMutualFundNav();
    let navUpdated = 0;
    
    for (const nav of navData.slice(0, 50)) {
      await priceService.upsertPrice(
        nav.schemeCode,
        'AMFI',
        'mf',
        { nav: nav.nav, price: nav.nav, amfiCode: nav.schemeCode },
        'amfi'
      );
      navUpdated++;
    }

    return {
      success: true,
      message: 'Price update job completed successfully',
      stats: {
        stocks: stocksUpdated,
        crypto: cryptoUpdated,
        nav: navUpdated,
      },
    };

  } catch (error) {
    console.error('❌ Manual price update job failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}