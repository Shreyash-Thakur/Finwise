const axios = require('axios');
const { config } = require('../config/env');
const { normalizeCryptoSymbol } = require('../utils/symbols');
const { Holding, LinkedAccount } = require('../models');
const mongoose = require('mongoose');

class WalletService {
  constructor() {
    this.covalentApiKey = config.apis.covalent.apiKey;
    this.covalentBaseUrl = 'https://api.covalenthq.com/v1';
  }

  /**
   * Validate wallet address format by chain
   */
  validateAddress(address, chainId) {
    const patterns = {
      ethereum: /^0x[a-fA-F0-9]{40}$/,
      polygon: /^0x[a-fA-F0-9]{40}$/,
      binance: /^0x[a-fA-F0-9]{40}$/,
      bitcoin: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
      solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    };

    const pattern = patterns[chainId.toLowerCase()];
    return pattern ? pattern.test(address) : false;
  }

  /**
   * Get chain ID for Covalent API
   */
  getCovalentChainId(chainId) {
    const chainIds = {
      ethereum: 1,
      polygon: 137,
      binance: 56,
      avalanche: 43114,
      fantom: 250,
      arbitrum: 42161,
      optimism: 10,
    };

    return chainIds[chainId.toLowerCase()] || 1;
  }

  /**
   * Fetch wallet balances using Covalent API
   */
  async fetchWalletBalances(address, chainId) {
    if (!this.covalentApiKey) {
      throw new Error('Covalent API key not configured');
    }

    if (!this.validateAddress(address, chainId)) {
      throw new Error(`Invalid ${chainId} address format`);
    }

    const covalentChainId = this.getCovalentChainId(chainId);
    const url = `${this.covalentBaseUrl}/${covalentChainId}/address/${address}/balances_v2/`;

    try {
      const response = await axios.get(url, {
        params: {
          'quote-currency': 'USD',
          'format': 'JSON',
          'nft': false,
          'no-nft-fetch': true,
        },
        headers: {
          Authorization: `Bearer ${this.covalentApiKey}`,
        },
      });

      return response.data.data.items
        .filter(item => parseFloat(item.balance) > 0)
        .map(item => ({
          symbol: item.contract_ticker_symbol || 'UNKNOWN',
          name: item.contract_name || 'Unknown Token',
          balance: parseFloat(item.balance) / Math.pow(10, item.contract_decimals),
          usdValue: item.quote || 0,
          contractAddress: item.contract_address,
        }))
        .filter(balance => balance.balance > 0.000001); // Filter out dust
    } catch (error) {
      console.error('Covalent API error:', error);
      throw new Error('Failed to fetch wallet balances');
    }
  }

  /**
   * Convert wallet balances to holdings and save to database
   */
  async syncWalletHoldings(userId, accountId, address, chainId) {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const balances = await this.fetchWalletBalances(address, chainId);

        // Clear existing holdings for this wallet account
        await Holding.deleteMany({
          userId: new mongoose.Types.ObjectId(userId),
          accountId: new mongoose.Types.ObjectId(accountId),
        }, { session });

        // Create new holdings from wallet balances
        for (const balance of balances) {
          const normalizedSymbol = normalizeCryptoSymbol(balance.symbol);
          
          await Holding.create([{
            userId: new mongoose.Types.ObjectId(userId),
            accountId: new mongoose.Types.ObjectId(accountId),
            symbol: normalizedSymbol,
            originalSymbol: balance.symbol,
            exchange: 'CRYPTO',
            assetType: 'crypto',
            quantity: balance.balance,
            averagePrice: balance.usdValue > 0 ? balance.usdValue / balance.balance : 0,
            currentPrice: balance.usdValue > 0 ? balance.usdValue / balance.balance : 0,
            totalInvested: balance.usdValue,
            marketValue: balance.usdValue,
            unrealizedPnL: 0, // Can't calculate without purchase history
            unrealizedPnLPercent: 0,
            currency: 'USD',
            lastUpdatedAt: new Date(),
            priceLastUpdatedAt: new Date(),
          }], { session });
        }

        // Update account sync status
        await LinkedAccount.findByIdAndUpdate(
          accountId,
          {
            syncStatus: 'success',
            lastSyncAt: new Date(),
            syncError: undefined,
          },
          { session }
        );
      });
    } catch (error) {
      // Update account sync status on error
      await LinkedAccount.findByIdAndUpdate(accountId, {
        syncStatus: 'error',
        syncError: error instanceof Error ? error.message : 'Unknown error during wallet sync',
      });

      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Get supported chains
   */
  getSupportedChains() {
    return ['ethereum', 'polygon', 'binance', 'avalanche', 'fantom', 'arbitrum', 'optimism'];
  }

  /**
   * Estimate gas fees for a transaction (placeholder for future implementation)
   */
  async estimateGasFees(chainId) {
    // TODO: Implement gas fee estimation
    console.log('TODO: Implement gas fee estimation for chain:', chainId);
    
    return {
      slow: 0,
      standard: 0,
      fast: 0,
    };
  }
}

module.exports = { WalletService };