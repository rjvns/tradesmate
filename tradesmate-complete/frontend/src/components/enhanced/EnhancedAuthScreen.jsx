import React, { useState, useEffect } from 'react';
import { Wrench, Mail, Lock, User, Phone, Building, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent } from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * Enhanced Authentication Screen - Industry-leading sign-in experience
 * 
 * Features:
 * - Progressive enhancement with smooth animations
 * - Real-time validation with helpful feedback
 * - Accessibility-first design with proper focus management
 * - Beautiful micro-interactions and transitions
 * - Responsive design optimized for all devices
 * - Error prevention and recovery patterns
 */

const EnhancedAuthScreen = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    company: '',
    tradeType: ''
  });

  const [validation, setValidation] = useState({
    email: null,
    password: null,
    name: null
  });

  // Real-time validation
  useEffect(() => {
    const newValidation = {};
    
    // Email validation
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      newValidation.email = emailRegex.test(formData.email);
    }
    
    // Password validation
    if (formData.password) {
      newValidation.password = formData.password.length >= 8;
    }
    
    // Name validation (for sign up)
    if (isSignUp && formData.name) {
      newValidation.name = formData.name.trim().length >= 2;
    }
    
    setValidation(newValidation);
  }, [formData, isSignUp]);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!validation.email) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validation.password) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (isSignUp) {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      }
      if (!formData.company.trim()) {
        newErrors.company = 'Company name is required';
      }
      if (!formData.tradeType) {
        newErrors.tradeType = 'Please select your trade type';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isSignUp) {
        setShowSuccess(true);
        setTimeout(() => {
          setIsSignUp(false);
          setShowSuccess(false);
          setFormData({
            email: formData.email,
            password: '',
            name: '',
            phone: '',
            company: '',
            tradeType: ''
          });
        }, 2000);
      } else {
        onLogin({
          name: 'Demo User',
          email: formData.email,
          company: 'Demo Company'
        });
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = () => {
    onLogin({
      name: 'Demo Tradesperson',
      email: 'demo@tradesmate.co.uk',
      company: 'Demo Electrical Services'
    });
  };

  const tradeTypes = [
    'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Roofer',
    'HVAC Technician', 'Flooring Installer', 'Landscaper', 'Mason', 'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      
      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-slide-in-top">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl mb-4">
            <Wrench className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            TradesMate
          </h1>
          <p className="text-blue-100 text-lg">
            AI-powered quotes & scheduling
          </p>
          <p className="text-blue-200 text-sm">
            for UK tradespeople
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <Card className="mb-6 bg-green-50 border-green-200 animate-scale-in">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Account created successfully!</p>
                  <p className="text-sm text-green-600">You can now sign in with your credentials.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Form Card */}
        <Card className="backdrop-blur-lg bg-white/95 border-white/20 animate-scale-in">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="text-gray-600">
                {isSignUp 
                  ? 'Join thousands of tradespeople using TradesMate' 
                  : 'Sign in to access your dashboard'
                }
              </p>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{errors.general}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sign Up Fields */}
              {isSignUp && (
                <div className="space-y-4 animate-slide-in-top">
                  <Input
                    label="Full Name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    leftIcon={<User className="h-5 w-5" />}
                    error={errors.name}
                    success={validation.name ? 'Looks good!' : null}
                    required
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange('phone')}
                      leftIcon={<Phone className="h-5 w-5" />}
                      placeholder="07700 900123"
                    />
                    
                    <Input
                      label="Company Name"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange('company')}
                      leftIcon={<Building className="h-5 w-5" />}
                      error={errors.company}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Trade Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.tradeType}
                      onChange={handleInputChange('tradeType')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    >
                      <option value="">Select your trade</option>
                      {tradeTypes.map(trade => (
                        <option key={trade} value={trade}>{trade}</option>
                      ))}
                    </select>
                    {errors.tradeType && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.tradeType}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Email Field */}
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                leftIcon={<Mail className="h-5 w-5" />}
                error={errors.email}
                success={validation.email ? 'Valid email address' : null}
                required
              />

              {/* Password Field */}
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                leftIcon={<Lock className="h-5 w-5" />}
                error={errors.password}
                success={validation.password ? 'Strong password' : null}
                helperText={isSignUp ? 'Must be at least 8 characters long' : undefined}
                required
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                loadingText={isSignUp ? 'Creating account...' : 'Signing in...'}
                className="w-full"
                disabled={isLoading}
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            {/* Toggle Auth Mode */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                {' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrors({});
                    setFormData({
                      email: formData.email,
                      password: '',
                      name: '',
                      phone: '',
                      company: '',
                      tradeType: ''
                    });
                  }}
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                >
                  {isSignUp ? 'Sign in here' : 'Sign up here'}
                </button>
              </p>
            </div>

            {/* Demo Access */}
            {!isSignUp && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleDemoAccess}
                  className="w-full"
                  leftIcon={<Briefcase className="h-5 w-5" />}
                >
                  Demo Access: Use any email/password to continue
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-blue-200 text-sm animate-fade-in">
          <p>Trusted by thousands of UK tradespeople</p>
          <p className="mt-1">© 2024 TradesMate. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAuthScreen;


