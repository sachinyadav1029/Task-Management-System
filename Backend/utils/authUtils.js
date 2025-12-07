import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Generate a 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '7d',
  });
};

export {
  generateOtp,
  generateToken,
};