import React from 'react';

/**
 * Loading Spinner Component - Beautiful loading states with accessibility
 * 
 * Features:
 * - Multiple variants for different contexts
 * - Proper ARIA labels for screen readers
 * - Smooth animations with reduced motion support
 * - Configurable sizes and colors
 * - Optimistic UI patterns
 */

const LoadingSpinner = ({ 
  size = 'md',
  variant = 'spinner',
  color = 'blue',
  text,
  className = '',
  'aria-label': ariaLabel = 'Loading'
}) => {

  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4', 
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colors = {
    blue: 'text-blue-500',
    gray: 'text-gray-500',
    green: 'text-green-500',
    red: 'text-red-500',
    orange: 'text-orange-500'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (variant === 'spinner') {
    return (
      <div 
        className={`flex items-center gap-3 ${className}`}
        role="status"
        aria-label={ariaLabel}
      >
        <svg
          className={`animate-spin ${sizes[size]} ${colors[color]}`}
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {text && (
          <span className={`${textSizes[size]} ${colors[color]} font-medium`}>
            {text}
          </span>
        )}
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div 
        className={`flex items-center gap-3 ${className}`}
        role="status"
        aria-label={ariaLabel}
      >
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`
                ${sizes[size]} ${colors[color]} bg-current rounded-full
                animate-pulse
              `}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
        {text && (
          <span className={`${textSizes[size]} ${colors[color]} font-medium`}>
            {text}
          </span>
        )}
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div 
        className={`flex items-center gap-3 ${className}`}
        role="status"
        aria-label={ariaLabel}
      >
        <div className={`${sizes[size]} ${colors[color]} bg-current rounded-full animate-pulse`} />
        {text && (
          <span className={`${textSizes[size]} ${colors[color]} font-medium`}>
            {text}
          </span>
        )}
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }

  return null;
};

/**
 * Skeleton Loader for content placeholders
 */
const SkeletonLoader = ({ 
  lines = 3,
  className = '',
  animate = true
}) => {
  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label="Loading content">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`
            h-4 bg-gray-200 rounded
            ${animate ? 'animate-pulse' : ''}
            ${i === lines - 1 ? 'w-3/4' : 'w-full'}
          `}
        />
      ))}
      <span className="sr-only">Loading content...</span>
    </div>
  );
};

/**
 * Card Skeleton for loading cards
 */
const CardSkeleton = ({ className = '' }) => {
  return (
    <div 
      className={`bg-white p-6 rounded-xl border border-gray-200 ${className}`}
      role="status" 
      aria-label="Loading card"
    >
      <div className="animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
      <span className="sr-only">Loading card content...</span>
    </div>
  );
};

export { LoadingSpinner, SkeletonLoader, CardSkeleton };
export default LoadingSpinner;


