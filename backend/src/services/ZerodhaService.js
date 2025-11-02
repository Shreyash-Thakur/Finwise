const axios = require('axios');
const { config } = require('../config/env');
const { encrypt, decrypt } = require('../utils/crypto');
const { LinkedAccount } = require('../models');

class ZerodhaService {
  constructor() {
    this.apiKey = config.apis.zerodha.apiKey;
    this.apiSecret = config.apis.zerodha.apiSecret;
    this.redirectUri = config.apis.zerodha.redirectUri;
    this.baseUrl = 'https://api.kite.trade';
  }

  /**
   * Build OAuth URL for Zerodha Kite Connect
   */
  buildAuthUrl(state) {
    const params = new URLSearchParams({
      api_key: this.apiKey,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      state,
    });

    return `https://kite.zerodha.com/connect/login?${params.toString()}`;
  }

  /**
   * Verify state parameter to prevent CSRF attacks
   */
  verifyState(receivedState, expectedState) {
    return receivedState === expectedState;
  }

  /**
   * Exchange request_token for access_token
   */
  async exchangeRequestToken(requestToken) {
    // TODO: Implement actual API call when feature flag is enabled
    if (!config.apis.zerodha.apiKey) {
      throw new Error('Zerodha API not configured');
    }

    // For now, return mock data
    // In production, implement:
    // 1. Generate checksum with request_token + api_secret
    // 2. POST to /session/token with api_key, request_token, checksum
    // 3. Return the response with access_token and user details

    throw new Error('Zerodha integration not yet implemented - TODO');
  }

  /**
   * Fetch user holdings from Zerodha
   */
  async fetchHoldings(accountId) {
    const account = await LinkedAccount.findById(accountId);
    if (!account || !account.encryptedAccessToken) {
      throw new Error('Account not found or not authenticated');
    }

    // Decrypt access token
    const accessToken = decrypt(account.encryptedAccessToken, config.encryption.key);

    // TODO: Implement actual API call
    // For now, return empty array
    // In production, implement:
    // 1. GET /portfolio/holdings with Authorization: token {access_token}
    // 2. Parse response and return holdings array

    console.log('TODO: Fetch holdings for access token:', accessToken.substring(0, 10) + '...');
    return [];
  }

  /**
   * Save encrypted access token to linked account
   */
  async saveAccessToken(accountId, authResponse) {
    const encryptedAccessToken = encrypt(authResponse.access_token, config.encryption.key);
    const encryptedRefreshToken = authResponse.refresh_token 
      ? encrypt(authResponse.refresh_token, config.encryption.key)
      : undefined;

    await LinkedAccount.findByIdAndUpdate(accountId, {
      encryptedAccessToken,
      encryptedRefreshToken,
      syncStatus: 'success',
      lastSyncAt: new Date(),
    });
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(accountId) {
    const account = await LinkedAccount.findById(accountId);
    if (!account || !account.encryptedRefreshToken) {
      throw new Error('Account not found or no refresh token available');
    }

    // TODO: Implement refresh token logic
    // For now, throw error
    throw new Error('Token refresh not yet implemented - TODO');
  }
}

module.exports = { ZerodhaService };