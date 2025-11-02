import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/index.js';
import { comparePassword } from '../utils/crypto.js';
import { config } from '../config/env.js';

// Serialize user for session storage
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password -refreshTokens');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Local Strategy (Email/Password Authentication)
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return done(null, false, { message: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    // Remove password from user object
    user.password = undefined;
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Google OAuth Strategy (only if credentials are provided)
if (config.google.clientId && config.google.clientSecret) {
  passport.use(new GoogleStrategy({
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackUrl
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      // User exists, update their information
      user.lastLogin = new Date();
      user.googleAccessToken = accessToken;
      if (refreshToken) {
        user.googleRefreshToken = refreshToken;
      }
      await user.save();
      
      return done(null, user);
    }

    // Check if user exists with the same email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.googleAccessToken = accessToken;
      if (refreshToken) {
        user.googleRefreshToken = refreshToken;
      }
      user.lastLogin = new Date();
      await user.save();
      
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      avatar: profile.photos[0]?.value,
      isEmailVerified: true, // Google accounts are pre-verified
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
      lastLogin: new Date(),
      authProvider: 'google'
    });
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
  }));
} else {
  console.log('Google OAuth credentials not provided. Google authentication will be disabled.');
}

export default passport;