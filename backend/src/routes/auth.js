import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { z } from 'zod';
import { User } from '../models/index.js';
import { hashPassword, comparePassword } from '../utils/crypto.js';
import { config } from '../config/env.js';
import { requireAuth } from '../middleware/session.js';

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register  
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body);
    const { email, password, name, phone } = registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    console.log('👤 Creating user with email:', email);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
    });
    console.log('✅ User created successfully:', user._id);

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    // Save refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        kycStatus: user.kycStatus,
      },
      accessToken,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.errors.map(e => e.message).join(', '),
      });
    }

    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration Failed',
      message: 'An error occurred during registration',
    });
  }
});

// Local Login (Email/Password)
router.post('/login/local', passport.authenticate('local', {
  failureMessage: true
}), async (req, res) => {
  try {
    // Update last login
    console.log(req.body)

    // Generate JWT token for API access
    const accessToken = jwt.sign(
      { userId: req.user._id, email: req.user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        kycStatus: req.user.kycStatus,
        role: req.user.role,
        avatar: req.user.avatar,
        authProvider: req.user.authProvider,
      },
      accessToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login Failed',
      message: 'An error occurred during login',
    });
  }
});

// Traditional login (backward compatibility)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await User.findOne({ email }).select('+password +refreshTokens');
    if (!user) {
      return res.status(401).json({
        error: 'Invalid Credentials',
        message: 'Email or password is incorrect',
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid Credentials',
        message: 'Email or password is incorrect',
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    // Add new refresh token
    user.refreshTokens.push(refreshToken);
    
    // Keep only last 5 refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    
    await user.save();

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        kycStatus: user.kycStatus,
        role: user.role,
      },
      accessToken,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.errors.map(e => e.message).join(', '),
      });
    }

    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login Failed',
      message: 'An error occurred during login',
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'No Refresh Token',
        message: 'Refresh token not provided',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    
    // Find user and check if refresh token exists
    const user = await User.findById(decoded.userId).select('+refreshTokens');
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({
        error: 'Invalid Refresh Token',
        message: 'Refresh token is invalid or expired',
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({
      message: 'Token refreshed successfully',
      accessToken,
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      error: 'Token Refresh Failed',
      message: 'Failed to refresh access token',
    });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Find user and remove refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
      const user = await User.findById(decoded.userId).select('+refreshTokens');
      
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
        await user.save();
      }
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      message: 'Logged out successfully',
    });

  } catch (error) {
    console.error('Logout error:', error);
    // Clear cookie anyway
    res.clearCookie('refreshToken');
    res.json({
      message: 'Logged out successfully',
    });
  }
});

// Google OAuth Routes (only if Google strategy is configured)
router.get('/google', (req, res, next) => {
  if (!config.google.clientId || !config.google.clientSecret) {
    return res.status(503).json({
      success: false,
      error: 'Google OAuth not configured',
      message: 'Google authentication is not available'
    });
  }
  
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!config.google.clientId || !config.google.clientSecret) {
    return res.redirect(`${config.app.origin}/login?error=google_oauth_not_configured`);
  }
  
  passport.authenticate('google', { 
    failureRedirect: `${config.app.origin}/login?error=google_auth_failed` 
  })(req, res, next);
}, async (req, res) => {
    try {
      // Generate JWT token for API access
      const accessToken = jwt.sign(
        { userId: req.user._id, email: req.user.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      // Redirect to frontend with success
      const redirectUrl = new URL('/auth/success', config.app.origin);
      redirectUrl.searchParams.set('token', accessToken);
      redirectUrl.searchParams.set('user', JSON.stringify({
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        avatar: req.user.avatar,
        authProvider: req.user.authProvider,
      }));

      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${config.app.origin}/login?error=callback_failed`);
    }
  }
);

// Session-based authentication check
router.get('/me', (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        kycStatus: req.user.kycStatus,
        role: req.user.role,
        avatar: req.user.avatar,
        authProvider: req.user.authProvider,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Not authenticated',
      message: 'No active session found',
    });
  }
});

// Session-based logout
router.post('/logout/session', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Logout Failed',
        message: 'Failed to end session',
      });
    }
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Session Destroy Failed',
          message: 'Failed to destroy session',
        });
      }
      
      res.clearCookie(config.session.name);
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });
});

export default router;