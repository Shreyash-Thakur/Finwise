import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { config } from '../config/env.js';

/**
 * JWT Authentication Middleware
 * Verifies JWT token and adds user to request object
 */
export const authenticateToken = async (req, res, next) => {
    console.log("here")
  
    try {
    console.log("here")
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log(token)
    if (!token) {
      return res.status(401).json({
        error: 'Access Denied',
        message: 'Access token is required',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid Token',
        message: 'User not found',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account Inactive',
        message: 'Your account has been deactivated',
      });
    }

    // Add user to request
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      kycStatus: user.kycStatus,
    };

    next();
  } catch (error) {
    console.log(error)
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Invalid Token',
        message: 'Access token is invalid',
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: 'Token Expired',
        message: 'Access token has expired',
      });
    }

    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Authentication Failed',
      message: 'An error occurred during authentication',
    });
  }
};

/**
 * Optional Authentication Middleware
 * Adds user to request if token is valid, but doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.userId);
    
    if (user && user.isActive) {
      req.user = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        kycStatus: user.kycStatus,
      };
    }

    next();
  } catch (error) {
    // Don't fail for optional auth, just continue without user
    next();
  }
};

/**
 * Role-based Authorization Middleware
 * Requires specific roles to access route
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication Required',
        message: 'You must be logged in to access this resource',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient Permissions',
        message: `Access denied. Required roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

/**
 * KYC Status Check Middleware
 * Requires specific KYC status levels
 */
export const requireKYC = (minLevel = 'pending') => {
  const kycLevels = {
    'none': 0,
    'pending': 1,
    'verified': 2,
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication Required',
        message: 'You must be logged in to access this resource',
      });
    }

    const userLevel = kycLevels[req.user.kycStatus] || 0;
    const requiredLevel = kycLevels[minLevel] || 0;

    if (userLevel < requiredLevel) {
      return res.status(403).json({
        error: 'KYC Required',
        message: `This action requires KYC status: ${minLevel}`,
      });
    }

    next();
  };
};

/**
 * Admin Only Middleware
 * Shortcut for admin role requirement
 */
export const requireAdmin = requireRole('admin');

/**
 * User Self-Access Middleware
 * Allows users to access their own resources or admins to access any
 */
export const requireSelfOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication Required',
      message: 'You must be logged in to access this resource',
    });
  }

  const targetUserId = req.params.userId || req.params.id;
  const isOwner = req.user.id.toString() === targetUserId;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      error: 'Access Denied',
      message: 'You can only access your own resources',
    });
  }

  next();
};

// Alias for backwards compatibility
export const verifyJWT = authenticateToken;