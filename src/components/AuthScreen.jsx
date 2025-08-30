import React, { useState } from 'react';
import { Eye, EyeOff, Wrench, Mail, Lock, User, Phone, Building, Briefcase } from 'lucide-react';

const Button = ({ children, onClick, className = '', variant = 'primary', size = 'default', disabled = false, type = 'button' }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
    secondary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl focus:ring-orange-500',
    outline: 'border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-700 focus:ring-blue-500',
    ghost: 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
  };
  
  const sizes = {
    default: 'px-6 py-3 text-base',
    sm: 'px-4 py-2 text-sm',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Input = ({ label, type = 'text', placeholder, value, onChange, icon: Icon, className = '', error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-white text-opacity-90">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-white text-opacity-50" />
          </div>
        )}
        <input
          type={inputType}
          className={`
            block w-full rounded-2xl transition-all duration-300
            ${Icon ? 'pl-12' : 'pl-4'}
            ${type === 'password' ? 'pr-12' : 'pr-4'}
            py-4 text-white placeholder-white placeholder-opacity-50
            bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20
            focus:bg-opacity-15 focus:border-opacity-40 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20
            text-base font-medium
            ${error ? 'border-red-400 border-opacity-50' : ''}
          `}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-white text-opacity-50 hover:text-opacity-80 transition-all" />
            ) : (
              <Eye className="h-5 w-5 text-white text-opacity-50 hover:text-opacity-80 transition-all" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-300 font-medium">{error}</p>
      )}
    </div>
  );
};

const Select = ({ label, value, onChange, options, className = '', error }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-white text-opacity-90">
          {label}
        </label>
      )}
      <select
        className={`
          block w-full rounded-2xl px-4 py-4 text-white transition-all duration-300
          bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20
          focus:bg-opacity-15 focus:border-opacity-40 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20
          text-base font-medium
          ${error ? 'border-red-400 border-opacity-50' : ''}
        `}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-800 text-white">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-300 font-medium">{error}</p>
      )}
    </div>
  );
};

const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    tradeType: 'electrician'
  });
  const [errors, setErrors] = useState({});

  const tradeTypes = [
    { value: 'electrician', label: 'Electrician' },
    { value: 'plumber', label: 'Plumber' },
    { value: 'heating_engineer', label: 'Heating Engineer' },
    { value: 'general_builder', label: 'General Builder' },
    { value: 'carpenter', label: 'Carpenter' },
    { value: 'decorator', label: 'Painter & Decorator' },
    { value: 'roofer', label: 'Roofer' },
    { value: 'gas_engineer', label: 'Gas Safe Engineer' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.companyName) newErrors.companyName = 'Company name is required';
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(isLogin ? 'Logging in...' : 'Signing up...', formData);
      
      // Mock successful authentication
      const user = {
        id: 1,
        email: formData.email,
        firstName: formData.firstName || 'Demo',
        lastName: formData.lastName || 'User',
        companyName: formData.companyName || 'Demo Trading Ltd',
        tradeType: formData.tradeType,
        phone: formData.phone || '07700 900123'
      };
      
      onLogin(user);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-600 to-slate-700 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-gray-600 to-blue-800 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-r from-slate-600 to-gray-700 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl mb-6 shadow-2xl border border-white border-opacity-20">
            <Wrench className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
            TradesMate
          </h1>
          <p className="text-white text-opacity-80 font-medium text-lg">
            AI-powered quotes & scheduling
          </p>
          <p className="text-white text-opacity-60 text-sm mt-1">
            for UK tradespeople
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white border-opacity-20 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-white text-opacity-70">
              {isLogin 
                ? 'Sign in to access your dashboard' 
                : 'Join thousands of UK tradespeople already using TradesMate'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    icon={User}
                    error={errors.firstName}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Smith"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    error={errors.lastName}
                  />
                </div>

                <Input
                  label="Company Name"
                  placeholder="Smith Electrical Services"
                  value={formData.companyName}
                  onChange={handleInputChange('companyName')}
                  icon={Building}
                  error={errors.companyName}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="07700 900123"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    icon={Phone}
                    error={errors.phone}
                  />
                  <Select
                    label="Trade Type"
                    value={formData.tradeType}
                    onChange={handleInputChange('tradeType')}
                    options={tradeTypes}
                    error={errors.tradeType}
                  />
                </div>
              </>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleInputChange('email')}
              icon={Mail}
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange('password')}
              icon={Lock}
              error={errors.password}
            />

            {!isLogin && (
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                icon={Lock}
                error={errors.confirmPassword}
              />
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white bg-opacity-20 backdrop-blur-md hover:bg-opacity-30 disabled:bg-opacity-10 
                         border border-white border-opacity-30 rounded-2xl py-4 px-6 
                         text-white font-bold text-lg transition-all duration-300 
                         shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95
                         focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <Briefcase className="h-6 w-6" />
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                </div>
              )}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-8 text-center">
            <p className="text-white text-opacity-70">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    phone: '',
                    companyName: '',
                    tradeType: 'electrician'
                  });
                }}
                className="font-bold text-white hover:text-opacity-90 transition-all underline underline-offset-2"
              >
                {isLogin ? 'Sign up here' : 'Sign in instead'}
              </button>
            </p>
          </div>

          {/* Demo Login Helper */}
          {isLogin && (
            <div className="mt-6 p-4 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-white border-opacity-20">
              <p className="text-sm text-white text-opacity-80 font-medium text-center">
                ✨ Demo Access: Use any email/password to continue
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white text-opacity-50 text-sm font-medium">
            Built with ❤️ for UK tradespeople
          </p>
          <p className="text-white text-opacity-30 text-xs mt-2">
            © 2025 TradesMate. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
