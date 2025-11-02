/**
 * Symbol normalization utilities for different exchanges and asset types
 */

/**
 * Normalizes NSE symbols by adding .NS suffix for Yahoo Finance compatibility
 */
function normalizeNSESymbol(symbol) {
  // Remove any existing suffix
  const cleanSymbol = symbol.replace(/\.(NS|BO)$/, '');
  return `${cleanSymbol}.NS`;
}

/**
 * Normalizes BSE symbols by adding .BO suffix
 */
function normalizeBSESymbol(symbol) {
  const cleanSymbol = symbol.replace(/\.(NS|BO)$/, '');
  return `${cleanSymbol}.BO`;
}

/**
 * Normalizes US stock symbols (removes any trailing exchanges)
 */
function normalizeUSSymbol(symbol) {
  // Remove common US exchange suffixes
  return symbol.replace(/\.(NASDAQ|NYSE|NYSEARCA)$/, '');
}

/**
 * Normalizes cryptocurrency symbols for CoinGecko API
 */
function normalizeCryptoSymbol(symbol) {
  const cryptoMap = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'ADA': 'cardano',
    'DOT': 'polkadot',
    'MATIC': 'polygon',
    'SOL': 'solana',
    'AVAX': 'avalanche-2',
    'ATOM': 'cosmos',
    'NEAR': 'near',
    'FIL': 'filecoin',
    'UNI': 'uniswap',
    'LINK': 'chainlink',
    'AAVE': 'aave',
  };
  
  return cryptoMap[symbol.toUpperCase()] || symbol.toLowerCase();
}

/**
 * Normalizes mutual fund symbols using AMFI codes
 */
function normalizeMFSymbol(amfiCode) {
  // AMFI codes are typically 6-digit numbers
  return amfiCode.padStart(6, '0');
}

/**
 * Auto-detects symbol type and normalizes accordingly
 */
function normalizeSymbol(symbol, exchange) {
  const upperSymbol = symbol.toUpperCase();
  
  // Crypto detection (common patterns)
  const cryptoPatterns = /^(BTC|ETH|ADA|DOT|MATIC|SOL|AVAX|ATOM|NEAR|FIL|UNI|LINK|AAVE|USDT|USDC|BNB|XRP|DOGE|SHIB)$/;
  if (cryptoPatterns.test(upperSymbol)) {
    return {
      symbol: upperSymbol,
      exchange: 'crypto',
      assetType: 'crypto',
      normalizedSymbol: normalizeCryptoSymbol(upperSymbol),
    };
  }
  
  // Mutual fund detection (6-digit AMFI codes)
  if (/^\d{6}$/.test(symbol)) {
    return {
      symbol,
      exchange: 'AMFI',
      assetType: 'mf',
      normalizedSymbol: normalizeMFSymbol(symbol),
    };
  }
  
  // Exchange-specific normalization
  if (exchange) {
    switch (exchange.toUpperCase()) {
      case 'NSE':
        return {
          symbol: upperSymbol,
          exchange: 'NSE',
          assetType: 'stock',
          normalizedSymbol: normalizeNSESymbol(upperSymbol),
        };
      case 'BSE':
        return {
          symbol: upperSymbol,
          exchange: 'BSE',
          assetType: 'stock',
          normalizedSymbol: normalizeBSESymbol(upperSymbol),
        };
      case 'NASDAQ':
      case 'NYSE':
        return {
          symbol: upperSymbol,
          exchange: exchange.toUpperCase(),
          assetType: 'stock',
          normalizedSymbol: normalizeUSSymbol(upperSymbol),
        };
    }
  }
  
  // Default: assume Indian stock (NSE)
  if (/^[A-Z]+$/.test(upperSymbol) && upperSymbol.length <= 10) {
    return {
      symbol: upperSymbol,
      exchange: 'NSE',
      assetType: 'stock',
      normalizedSymbol: normalizeNSESymbol(upperSymbol),
    };
  }
  
  // Fallback
  return {
    symbol: upperSymbol,
    exchange: 'UNKNOWN',
    assetType: 'stock',
    normalizedSymbol: upperSymbol,
  };
}

/**
 * Converts Groww CSV symbols to standard format
 */
function normalizeGrowwSymbol(symbol) {
  // Groww format examples: "RELIANCE", "TCS", "INFY"
  return normalizeSymbol(symbol, 'NSE');
}

/**
 * Converts Zerodha symbols to standard format
 */
function normalizeZerodhaSymbol(symbol, exchange) {
  // Zerodha format: symbol without suffix, exchange separate
  return normalizeSymbol(symbol, exchange);
}

/**
 * Gets display name for a symbol (user-friendly)
 */
function getDisplayName(symbolInfo) {
  const companyNames = {
    'RELIANCE': 'Reliance Industries',
    'TCS': 'Tata Consultancy Services',
    'INFY': 'Infosys',
    'HDFCBANK': 'HDFC Bank',
    'ICICIBANK': 'ICICI Bank',
    'BHARTIARTL': 'Bharti Airtel',
    'ITC': 'ITC Limited',
    'LT': 'Larsen & Toubro',
    'AXISBANK': 'Axis Bank',
    'KOTAKBANK': 'Kotak Mahindra Bank',
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'ADA': 'Cardano',
    'DOT': 'Polkadot',
  };
  
  return companyNames[symbolInfo.symbol] || symbolInfo.symbol;
}

module.exports = {
  normalizeNSESymbol,
  normalizeBSESymbol,
  normalizeUSSymbol,
  normalizeCryptoSymbol,
  normalizeMFSymbol,
  normalizeSymbol,
  normalizeGrowwSymbol,
  normalizeZerodhaSymbol,
  getDisplayName,
};