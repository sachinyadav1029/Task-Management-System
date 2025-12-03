import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

// const API_BASE = "http://localhost:3000/auth";

const API_BASE = `${import.meta.env.VITE_API_URL}/auth`;

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      setStep('password');
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;
    
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE}/login`, {
        email,
        password
      });

      // Login successful
      onLogin(response.data.user, response.data.token);
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 401) {
        setError(error.response.data.message || 'Invalid credentials');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE}/forgot-password`, {
        email
      });

      setMessage(response.data.message || 'OTP has been sent to your email');
      setStep('forgotPassword');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const verifyResponse = await axios.post(`${API_BASE}/verify-reset-otp`, {
        email,
        otp
      });

      if (verifyResponse.data.verified) {
        setMessage('OTP verified successfully. You can now reset your password.');
        setResetToken(verifyResponse.data.resetToken);
        setStep('resetPassword');
      } else {
        setError('OTP verification failed.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE}/reset-password`, {
        email,
        otp,
        newPassword,
        resetToken
      });

      setMessage(response.data.message || 'Password reset successfully! You can now login with your new password');
      
      setTimeout(() => {
        setStep('password');
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setOtp('');
        setResetToken('');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE}/forgot-password`, {
        email
      });

      setMessage(response.data.message || 'New OTP has been sent to your email');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center">
          <div className="flex justify-center">
            <CheckCircleIcon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
          </div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900">
            {step === 'forgotPassword' || step === 'resetPassword' ? 'Reset Password' : 'Welcome back to TaskFlow'}
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-600 px-2">
            {step === 'forgotPassword' ? 'Enter OTP sent to your email' : 
             step === 'resetPassword' ? 'Set your new password' :
             'Sign in to your account to continue managing your tasks'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mt-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-xs sm:text-sm">
              {error}
            </div>
          )}
          
          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 border border-green-300 text-green-700 text-xs sm:text-sm">
              {message}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent" />
                ) : (
                  'Continue'
                )}
              </button>
            </form>
          ) : step === 'password' ? (
            <>
              <div className="text-center mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-gray-600">Welcome back! Sign in as</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base break-all">{email}</p>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-blue-600 hover:text-blue-500 text-xs sm:text-sm mt-1"
                >
                  Change email
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-3 py-2 sm:py-3 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-blue-600 hover:text-blue-500 text-xs sm:text-sm"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </>
          ) : step === 'forgotPassword' ? (
            <form onSubmit={handleOtpSubmit} className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-gray-600">We've sent a 6-digit OTP to</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base break-all">{email}</p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="mt-1 block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-lg sm:text-xl tracking-widest"
                  placeholder="000000"
                />
                <p className="mt-2 text-xs text-gray-500">Enter the 6-digit code sent to your email</p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-500 text-xs sm:text-sm disabled:text-gray-400"
                >
                  {loading ? 'Resending...' : 'Resend OTP'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent" />
                ) : (
                  'Verify OTP'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('password')}
                  className="text-blue-600 hover:text-blue-500 text-xs sm:text-sm"
                >
                  Back to login
                </button>
              </div>
            </form>
          ) : step === 'resetPassword' ? (
            <form onSubmit={handleResetPassword} className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-gray-600">Set your new password for</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base break-all">{email}</p>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full px-3 py-2 sm:py-3 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full px-3 py-2 sm:py-3 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent" />
                ) : (
                  'Reset Password'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('forgotPassword')}
                  className="text-blue-600 hover:text-blue-500 text-xs sm:text-sm"
                >
                  Back to OTP verification
                </button>
              </div>
            </form>
          ) : null}

          {(step === 'email' || step === 'password') && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6">
                <Link
                  to="/signup"
                  className="w-full flex justify-center py-2 sm:py-3 px-4 border border-blue-600 rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Create new account
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
