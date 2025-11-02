const csvParser = require('csv-parser');
const { Readable } = require('stream');
const { normalizeGrowwSymbol } = require('../utils/symbols');
const { Holding, LinkedAccount } = require('../models');
const mongoose = require('mongoose');

class GrowwCsvService {
  /**
   * Parse Groww CSV buffer and extract holdings data
   */
  async parseCsvBuffer(csvBuffer) {
    return new Promise((resolve, reject) => {
      const results = [];
      const stream = Readable.from(csvBuffer.toString());

      stream
        .pipe(csvParser())
        .on('data', (row) => {
          try {
            const parsed = this.parseRow(row);
            if (parsed) {
              results.push(parsed);
            }
          } catch (error) {
            console.error('Error parsing CSV row:', error, row);
            // Continue processing other rows
          }
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   * Parse individual CSV row to holding data
   */
  parseRow(row) {
    // Skip empty or invalid rows
    if (!row.Symbol || !row.Quantity || !row['Average Price']) {
      return null;
    }

    // Clean numeric values
    const quantity = this.parseNumber(row.Quantity);
    const averagePrice = this.parseNumber(row['Average Price']);
    const currentPrice = this.parseNumber(row['Current Price']);
    const totalInvested = this.parseNumber(row['Investment Value']);
    const marketValue = this.parseNumber(row['Current Value']);
    const unrealizedPnL = this.parseNumber(row['P&L']);

    if (quantity <= 0 || averagePrice <= 0) {
      return null;
    }

    // Normalize symbol
    const symbolInfo = normalizeGrowwSymbol(row.Symbol.trim());

    return {
      symbol: symbolInfo.normalizedSymbol,
      originalSymbol: row.Symbol.trim(),
      exchange: symbolInfo.exchange,
      assetType: symbolInfo.assetType,
      quantity,
      averagePrice,
      currentPrice: currentPrice || averagePrice,
      totalInvested: totalInvested || (quantity * averagePrice),
      marketValue: marketValue || (quantity * (currentPrice || averagePrice)),
      unrealizedPnL: unrealizedPnL || 0,
    };
  }

  /**
   * Parse number from string, handling Indian number format
   */
  parseNumber(value) {
    if (!value || value.trim() === '') return 0;
    
    // Remove commas, currency symbols, and other non-numeric characters
    const cleanValue = value
      .replace(/[₹,\s]/g, '')
      .replace(/[()]/g, '') // Remove parentheses for negative numbers
      .trim();

    const number = parseFloat(cleanValue);
    return isNaN(number) ? 0 : number;
  }

  /**
   * Upsert holdings to database
   */
  async upsertHoldings(userId, accountId, holdings) {
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        for (const holding of holdings) {
          await Holding.findOneAndUpdate(
            {
              userId: new mongoose.Types.ObjectId(userId),
              accountId: new mongoose.Types.ObjectId(accountId),
              symbol: holding.symbol,
            },
            {
              originalSymbol: holding.originalSymbol,
              exchange: holding.exchange,
              assetType: holding.assetType,
              quantity: holding.quantity,
              averagePrice: holding.averagePrice,
              currentPrice: holding.currentPrice,
              totalInvested: holding.totalInvested,
              marketValue: holding.marketValue,
              unrealizedPnL: holding.unrealizedPnL,
              unrealizedPnLPercent: holding.totalInvested > 0 
                ? (holding.unrealizedPnL / holding.totalInvested) * 100 
                : 0,
              lastUpdatedAt: new Date(),
              priceLastUpdatedAt: new Date(),
            },
            {
              upsert: true,
              new: true,
              session,
            }
          );
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
        syncError: error instanceof Error ? error.message : 'Unknown error during CSV sync',
      });
      
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Validate CSV format before processing
   */
  validateCsvFormat(csvBuffer) {
    const csvString = csvBuffer.toString();
    const lines = csvString.split('\n');
    
    if (lines.length < 2) {
      return false; // Need at least header + 1 data row
    }

    const header = lines[0].toLowerCase();
    const requiredColumns = ['symbol', 'quantity', 'average price'];
    
    return requiredColumns.every(col => header.includes(col));
  }
}

module.exports = { GrowwCsvService };