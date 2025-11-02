/**
 * Mutual Funds Service - Integrates with mfapi.in for mutual fund data
 * Provides paginated fund lists and detailed NAV history
 */

import axios from 'axios';

const BASE_URL = 'https://api.mfapi.in';
const DEFAULT_LIMIT = 15;
const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * Create axios instance with default configuration
 */
const mfApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'User-Agent': 'FinWise-App/1.0.0',
    'Accept': 'application/json',
  },
});

/**
 * Add response interceptor for error handling
 */
mfApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('MF API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });
    throw error;
  }
);

/**
 * Hardcoded list of 8 popular mutual fund scheme codes
 */
const FEATURED_SCHEME_CODES = [
  '125497', // SBI Small Cap Fund - Direct Plan - Growth
  '120716', // UTI Nifty 50 Index Fund - Growth Option- Direct
  '118989', // HDFC Top 100 Fund - Direct Plan - Growth
  '119226', // Axis Bluechip Fund - Direct Plan - Growth
  '118825', // ICICI Prudential Value Discovery Fund - Direct Plan - Growth
  '119551', // Kotak Standard Multicap Fund - Direct Plan - Growth
  '120503', // Mirae Asset Large Cap Fund - Direct Plan - Growth
  '118834', // DSP Tax Saver Fund - Direct Plan - Growth
];

/**
 * Get details for 8 featured mutual funds
 * @returns {Promise<Object>} List of 8 mutual funds with their details
 */
export async function getMutualFundsList() {
  try {
    const fundPromises = FEATURED_SCHEME_CODES.map(async (schemeCode) => {
      try {
        const fundSummary = await getMutualFundSummary(schemeCode);
        if (fundSummary.success) {
          return {
            schemeCode: fundSummary.data.schemeCode,
            schemeName: fundSummary.data.schemeName,
            fundHouse: fundSummary.data.fundHouse,
            category: fundSummary.data.category,
            schemeType: fundSummary.data.schemeType,
            latestNav: fundSummary.data.latest.nav,
            navDate: fundSummary.data.latest.date,
            returns: fundSummary.data.returns,
            expenseRatio: fundSummary.data.expenseRatio,
            aumCr: fundSummary.data.aumCr,
            risk: fundSummary.data.risk,
          };
        } else {
          console.warn(`Failed to fetch details for scheme ${schemeCode}:`, fundSummary.error);
          return null;
        }
      } catch (error) {
        console.error(`Error fetching scheme ${schemeCode}:`, error);
        return null;
      }
    });

    // Wait for all fund details to be fetched
    const fundResults = await Promise.all(fundPromises);
    
    // Filter out failed requests
    const funds = fundResults.filter(fund => fund !== null);
    
    return {
      success: true,
      data: {
        funds,
        count: funds.length,
        total: FEATURED_SCHEME_CODES.length,
        message: `Fetched ${funds.length} out of ${FEATURED_SCHEME_CODES.length} featured mutual funds`,
      },
    };
  } catch (error) {
    console.error('Error fetching featured mutual funds:', error);
    return {
      success: false,
      error: 'Failed to fetch featured mutual funds',
      details: error.message,
    };
  }
}

/**
 * Get detailed information for a specific mutual fund
 * @param {string} schemeCode - Scheme code of the mutual fund
 * @returns {Promise<Object>} Fund details with NAV history
 */
export async function getMutualFundDetails(schemeCode) {
  try {
    if (!schemeCode) {
      throw new Error('Scheme code is required');
    }
    
    const response = await mfApiClient.get(`/mf/${schemeCode}`);
    
    // Transform and validate the response data
    const fundData = response.data;
    
    if (!fundData) {
      throw new Error('No data received for the requested scheme');
    }
    
    // Structure the response consistently
    const transformedData = {
      meta: {
        fund_house: fundData.meta?.fund_house || null,
        scheme_type: fundData.meta?.scheme_type || null,
        scheme_category: fundData.meta?.scheme_category || null,
        scheme_code: fundData.meta?.scheme_code || schemeCode,
        scheme_name: fundData.meta?.scheme_name || null,
      },
      data: (fundData.data || []).map(navEntry => ({
        date: navEntry.date,
        nav: parseFloat(navEntry.nav) || 0,
      })).filter(entry => entry.nav > 0), // Filter out invalid NAV entries
      status: fundData.status || 'success',
    };
    
    return {
      success: true,
      data: transformedData,
    };
  } catch (error) {
    console.error(`Error fetching fund details for ${schemeCode}:`, error);
    return {
      success: false,
      error: 'Failed to fetch fund details',
      details: error.message,
    };
  }
}

/**
 * Search mutual funds by name or scheme code
 * @param {string} query - Search query
 * @param {number} limit - Maximum results to return
 * @returns {Promise<Object>} Search results
 */
export async function searchMutualFunds(query, limit = 20) {
  try {
    if (!query || query.trim().length < 2) {
      return {
        success: false,
        error: 'Search query must be at least 2 characters long',
      };
    }
    
    // For now, we'll fetch a larger set and filter client-side
    // In a production app, you might want to implement server-side caching
    const response = await mfApiClient.get('/mf', {
      params: { limit: 100, offset: 0 },
    });
    
    const searchTerm = query.toLowerCase().trim();
    const filteredFunds = response.data
      .filter(fund => 
        fund.schemeName?.toLowerCase().includes(searchTerm) ||
        fund.schemeCode?.toString().includes(searchTerm)
      )
      .slice(0, limit)
      .map(fund => ({
        schemeCode: fund.schemeCode,
        schemeName: fund.schemeName,
        fundHouse: fund.fundHouse || null,
        schemeType: fund.schemeType || null,
        schemeCategory: fund.schemeCategory || null,
      }));
    
    return {
      success: true,
      data: {
        query,
        results: filteredFunds,
        count: filteredFunds.length,
      },
    };
  } catch (error) {
    console.error('Error searching mutual funds:', error);
    return {
      success: false,
      error: 'Failed to search mutual funds',
      details: error.message,
    };
  }
}

/**
 * Get latest NAV for a specific fund
 * @param {string} schemeCode - Scheme code of the mutual fund
 * @returns {Promise<Object>} Latest NAV data
 */
export async function getLatestNAV(schemeCode) {
  try {
    const fundDetails = await getMutualFundDetails(schemeCode);
    
    if (!fundDetails.success) {
      return fundDetails;
    }
    
    const navData = fundDetails.data.data;
    const latestNav = navData && navData.length > 0 ? navData[0] : null;
    
    if (!latestNav) {
      return {
        success: false,
        error: 'No NAV data available for this fund',
      };
    }
    
    return {
      success: true,
      data: {
        schemeCode,
        schemeName: fundDetails.data.meta.scheme_name,
        latestNav: latestNav.nav,
        navDate: latestNav.date,
        fundHouse: fundDetails.data.meta.fund_house,
      },
    };
  } catch (error) {
    console.error(`Error fetching latest NAV for ${schemeCode}:`, error);
    return {
      success: false,
      error: 'Failed to fetch latest NAV',
      details: error.message,
    };
  }
}

/**
 * Helper function to find NAV on or just before a target date
 * @param {string} targetISO - Target date in ISO format (YYYY-MM-DD)
 * @param {Array} series - NAV series array with {date: "DD-MM-YYYY", nav: "123.45"}
 * @returns {number|null} NAV value or null if not found
 */
function navOnOrBefore(targetISO, series) {
  const tgt = new Date(targetISO + 'T00:00:00Z');
  
  // series is [{date:"DD-MM-YYYY", nav:"123.45"}, ...] (latest first per MFapi)
  // normalize and pick the last nav whose date <= target
  for (const row of series) {
    const [dd, mm, yyyy] = row.date.split('-');
    const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);
    if (d <= tgt) return parseFloat(row.nav);
  }
  return null;
}

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 * @param {Object} params - Parameters for CAGR calculation
 * @param {number} params.startNav - Starting NAV value
 * @param {number} params.endNav - Ending NAV value
 * @param {number} params.years - Number of years
 * @returns {number|null} CAGR as decimal (multiply by 100 for percentage) or null
 */
function cagr({ startNav, endNav, years }) {
  if (!startNav || !endNav || startNav <= 0 || years <= 0) return null;
  return Math.pow(endNav / startNav, 1 / years) - 1;
}

/**
 * Helper function to get ISO date X years back from today
 * @param {number} years - Number of years to go back
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
function yearsBackISO(years) {
  const d = new Date();
  d.setUTCFullYear(d.getUTCFullYear() - years);
  return d.toISOString().slice(0, 10);
}

/**
 * Get comprehensive mutual fund summary with calculated returns
 * @param {string} schemeCode - Scheme code of the mutual fund
 * @returns {Promise<Object>} Fund summary with NAV, returns, and metadata
 */
export async function getMutualFundSummary(schemeCode) {
  try {
    if (!schemeCode) {
      throw new Error('Scheme code is required');
    }

    // 1) Get latest NAV (also contains 'meta')
    const latestUrl = `/mf/${schemeCode}/latest`;
    const latestResponse = await mfApiClient.get(latestUrl, { timeout: 15000 });

    if (!latestResponse.data?.data?.length) {
      return {
        success: false,
        error: 'Scheme not found or no latest NAV available',
      };
    }

    const meta = latestResponse.data.meta;
    const latestNav = parseFloat(latestResponse.data.data[0].nav);
    const latestDate = latestResponse.data.data[0].date; // "DD-MM-YYYY"

    // 2) Get full history for CAGR calculations
    const historyUrl = `/mf/${schemeCode}`;
    const historyResponse = await mfApiClient.get(historyUrl, { timeout: 20000 });

    const series = historyResponse.data?.data || [];
    if (!series.length) {
      return {
        success: false,
        error: 'NAV history unavailable',
      };
    }

    // Calculate historical NAV values
    const nav1Y = navOnOrBefore(yearsBackISO(1), series);
    const nav3Y = navOnOrBefore(yearsBackISO(3), series);
    const nav5Y = navOnOrBefore(yearsBackISO(5), series);

    // Calculate CAGR returns
    const cagr1Y = cagr({ startNav: nav1Y, endNav: latestNav, years: 1 });
    const cagr3Y = cagr({ startNav: nav3Y, endNav: latestNav, years: 3 });
    const cagr5Y = cagr({ startNav: nav5Y, endNav: latestNav, years: 5 });

    // TODO: These fields need to be sourced from another provider or your own DB
    const expenseRatio = null; // e.g., from paid provider or scraped once & cached
    const aumCr = null;        // AUM in Cr
    const risk = null;         // "High", "Moderate" etc (SEBI Riskometer)

    return {
      success: true,
      data: {
        schemeCode: meta.scheme_code,
        schemeName: meta.scheme_name,
        fundHouse: meta.fund_house,
        category: meta.scheme_category,   // e.g., "Equity - Large Cap"
        schemeType: meta.scheme_type,     // e.g., "Open Ended Schemes"
        latest: {
          date: latestDate,
          nav: latestNav,
        },
        returns: {
          oneYear: cagr1Y !== null ? +(cagr1Y * 100).toFixed(2) : null,
          threeYear: cagr3Y !== null ? +(cagr3Y * 100).toFixed(2) : null,
          fiveYear: cagr5Y !== null ? +(cagr5Y * 100).toFixed(2) : null,
        },
        // Fields your card needs but MFapi doesn't provide:
        expenseRatio,  // %
        aumCr,         // number (Cr)
        risk,          // "High" | "Moderate" | ...
        // Raw for debugging if needed:
        _source: {
          mfapi_latest: `${BASE_URL}${latestUrl}`,
          mfapi_history: `${BASE_URL}${historyUrl}`,
        },
      },
    };
  } catch (error) {
    console.error(`Error fetching fund summary for ${schemeCode}:`, error);
    return {
      success: false,
      error: 'Failed to fetch or compute fund summary',
      details: error.message,
    };
  }
}

/**
 * Health check for the mutual funds API
 * @returns {Promise<Object>} API status
 */
export async function checkMFApiHealth() {
  try {
    const response = await mfApiClient.get('/mf', {
      params: { limit: 1, offset: 0 },
      timeout: 5000,
    });
    
    return {
      success: true,
      status: 'healthy',
      responseTime: response.headers['x-response-time'] || 'unknown',
    };
  } catch (error) {
    return {
      success: false,
      status: 'unhealthy',
      error: error.message,
    };
  }
}