import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

// const API_BASE = "http://localhost:3000/auth";

const API_BASE = `${import.meta.env.VITE_API_URL}/auth`;

const SignupPage = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: '',
  });
  const [step, setStep] = useState('details');
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;

    setError('');
    setInfo('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.message === "User already exists") {
        setError(`User ${formData.email} already exists. Try logging in instead.`);
        setLoading(false);
        return;
      }

      if (response.data.expiresAt) {
        // Handle both ISO string and regular date formats
        const expiresAt = typeof response.data.expiresAt === 'string'
          ? new Date(response.data.expiresAt)
          : new Date(response.data.expiresAt);
        setOtpExpiresAt(expiresAt);
      }

      // Set the resend cooldown when moving to OTP step
      setResendCooldown(120);
      
      setInfo('OTP sent successfully 🚀');
      setTimeout(() => {
        setInfo('');
        setStep('otp');
      }, 1000);
    } catch (err) {
      // Enhanced error handling
      const errorMessage = err.response?.data?.message || "Failed to send the OTP";
      console.error('Signup error:', err);
      console.error('Error response:', err.response?.data);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (formData.otp.length !== 6) return;

    setError('');
    setInfo('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
      });

      // Pass the user object and token to onSignup
      onSignup(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setError('');
    setResendLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/resend-otp`, { email: formData.email });

      if (response.data.expiresAt) {
        // Handle both ISO string and regular date formats
        const expiresAt = typeof response.data.expiresAt === 'string'
          ? new Date(response.data.expiresAt)
          : new Date(response.data.expiresAt);
        setOtpExpiresAt(expiresAt);
      }

      setInfo('A new OTP has been sent to your email! ✉️');
      setFormData(prev => ({ ...prev, otp: '' }));

      setResendCooldown(120);
    } catch (err) {
      // Enhanced error handling
      const errorMessage = err.response?.data?.message || "Failed to resend OTP";
      console.error('Resend OTP error:', err);
      console.error('Error response:', err.response?.data);
      setError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [timeLeft, setTimeLeft] = useState(null);

  // OTP expiration countdown
  useEffect(() => {
    if (!otpExpiresAt) return;

    // Initialize timer immediately
    const updateTimer = () => {
      const now = new Date();
      const diff = otpExpiresAt - now;

      if (diff <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0, expired: true });
        return false;
      } else {
        setTimeLeft({
          minutes: Math.floor(diff / 1000 / 60),
          seconds: Math.floor((diff / 1000) % 60),
          expired: false,
        });
        return true;
      }
    };

    // Update immediately
    if (!updateTimer()) return;

    const timer = setInterval(() => {
      if (!updateTimer()) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [otpExpiresAt]);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-4"
      >
        <div className="flex justify-center">
          <CheckCircleIcon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
        </div>
        <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900">
          Join TaskFlow Today
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-gray-600 px-2">
          Create your account and start managing tasks like a pro
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mt-6">
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 text-xs sm:text-sm"
              >
                {error}{' '}
                <Link to="/login" className="text-blue-600 hover:underline ml-1">
                  Login
                </Link>
              </motion.div>
            )}
            {info && (
              <motion.div
                key="info"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="p-3 mb-4 rounded-lg bg-green-100 border border-green-300 text-green-700 text-xs sm:text-sm"
              >
                {info}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === 'details' && (
              <motion.form
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleDetailsSubmit}
                className="space-y-4 sm:space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="mt-1 relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 sm:py-3 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      placeholder="Enter a strong password"
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
                <button
                  type="submit"
                  disabled={loading || !formData.name || !formData.email || !formData.password}
                  className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </motion.form>
            )}

            {step === 'otp' && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleOtpSubmit}
                className="space-y-4 sm:space-y-6"
              >
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    Welcome, <span className="font-medium">{formData.name}</span>!
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">We've sent a 6-digit OTP to</p>
                  <p className="font-medium text-gray-900 text-sm sm:text-base break-all">{formData.email}</p>
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="text-blue-600 hover:text-blue-500 text-xs sm:text-sm mt-2"
                  >
                    Change details
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                  <div className="mt-1 relative">
                    <input
                      name="otp"
                      type={showOtp ? 'text' : 'password'}
                      required
                      maxLength={6}
                      value={formData.otp}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          otp: e.target.value.replace(/\D/g, ''),
                        }))
                      }
                      className="block w-full px-3 py-2 sm:py-3 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-lg sm:text-xl tracking-widest"
                      placeholder="000000"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOtp(!showOtp)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showOtp ? (
                        <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {timeLeft && !timeLeft.expired && (
                    <p className="mt-2 text-xs text-gray-500">
                      OTP expires in: {timeLeft.minutes}:{String(timeLeft.seconds).padStart(2, '0')}
                    </p>
                  )}

                  {timeLeft && timeLeft.expired && (
                    <p className="mt-2 text-xs text-red-500 font-medium">
                      OTP has expired. Please request a new one.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || formData.otp.length !== 6 || (timeLeft && timeLeft.expired)}
                  className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    'Create Account'
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 text-xs sm:text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
                    onClick={handleResendOtp}
                    disabled={resendLoading || resendCooldown > 0}
                  >
                    {resendLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-blue-600 border-t-transparent mr-1"></div>
                        Resending...
                      </span>
                    ) : resendCooldown > 0 ? (
                      `Resend available in ${Math.floor(resendCooldown / 60)}:${String(
                        resendCooldown % 60
                      ).padStart(2, '0')}`
                    ) : (
                      "Didn't receive OTP? Resend"
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 sm:py-3 px-4 border border-blue-600 rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign in to existing account
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;