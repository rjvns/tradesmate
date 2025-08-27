import React, { forwardRef, useState, useId } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Input Component - Accessible form input with validation and enhanced UX
 * 
 * Features:
 * - WCAG AAA compliance with proper labeling
 * - Real-time validation feedback
 * - Password visibility toggle
 * - Loading and error states
 * - Floating label animation
 * - Full keyboard navigation
 */

const Input = forwardRef(({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  loading = false,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  required = false,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props 
}, ref) => {

  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;
  const isFloatingLabel = isFocused || hasValue || placeholder;

  const handleChange = (e) => {
    setHasValue(!!e.target.value);
    onChange?.(e);
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine aria-describedby
  const describedBy = [
    ariaDescribedBy,
    helperText ? helperId : null,
    error ? errorId : null
  ].filter(Boolean).join(' ') || undefined;

  const inputClasses = [
    // Base styles
    'w-full px-4 py-3 text-base',
    'bg-white border rounded-lg',
    'transition-all duration-200 ease-out',
    'placeholder:text-gray-400',
    
    // Focus styles
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    
    // Icon padding
    leftIcon ? 'pl-11' : '',
    (rightIcon || type === 'password') ? 'pr-11' : '',
    
    // Label floating adjustment
    label ? 'pt-6 pb-2' : '',
    
    // State-based styling
    hasError ? [
      'border-red-300 focus:border-red-500 focus:ring-red-500/20',
      'bg-red-50'
    ].join(' ') : hasSuccess ? [
      'border-green-300 focus:border-green-500 focus:ring-green-500/20',
      'bg-green-50'
    ].join(' ') : [
      'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20',
      'hover:border-gray-400'
    ].join(' '),
    
    // Disabled state
    disabled ? [
      'bg-gray-50 border-gray-200 text-gray-500',
      'cursor-not-allowed'
    ].join(' ') : '',
    
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="relative">
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        {/* Main Input */}
        <input
          ref={ref}
          id={id}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={label ? undefined : placeholder}
          required={required}
          aria-invalid={ariaInvalid || hasError}
          aria-describedby={describedBy}
          aria-label={!label ? placeholder : undefined}
          className={inputClasses}
          {...props}
        />

        {/* Floating Label */}
        {label && (
          <label
            htmlFor={id}
            className={`
              absolute left-4 transition-all duration-200 ease-out pointer-events-none
              ${isFloatingLabel 
                ? 'top-2 text-xs text-gray-500' 
                : 'top-1/2 -translate-y-1/2 text-base text-gray-400'
              }
              ${hasError ? 'text-red-500' : hasSuccess ? 'text-green-500' : ''}
              ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
            `}
          >
            {label}
          </label>
        )}

        {/* Right Side Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Loading Spinner */}
          {loading && (
            <div className="h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          )}

          {/* Success Icon */}
          {!loading && hasSuccess && (
            <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
          )}

          {/* Error Icon */}
          {!loading && hasError && (
            <AlertCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
          )}

          {/* Password Toggle */}
          {type === 'password' && !loading && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Custom Right Icon */}
          {!loading && rightIcon && type !== 'password' && (
            <div className="text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
      </div>

      {/* Helper Text */}
      {helperText && !error && (
        <p 
          id={helperId}
          className="mt-2 text-sm text-gray-600"
        >
          {helperText}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p 
          id={errorId}
          className="mt-2 text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Success Message */}
      {success && !error && (
        <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          {success}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
