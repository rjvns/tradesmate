import React, { forwardRef } from 'react';

/**
 * Card Component System - Accessible card components with perfect visual hierarchy
 * 
 * Features:
 * - Semantic HTML structure for screen readers
 * - Elevation system with consistent shadows
 * - Hover states and micro-interactions
 * - Responsive design patterns
 * - Perfect accessibility support
 */

const Card = forwardRef(({ 
  children, 
  variant = 'default',
  hover = false,
  interactive = false,
  className = '',
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  onClick,
  ...props 
}, ref) => {

  const baseClasses = [
    'bg-white rounded-xl border border-gray-200',
    'transition-all duration-200 ease-out',
    'overflow-hidden'
  ].join(' ');

  const variants = {
    default: 'shadow-sm',
    elevated: 'shadow-lg',
    floating: 'shadow-xl',
    outlined: 'border-2 shadow-none'
  };

  const interactiveClasses = interactive || onClick ? [
    'cursor-pointer',
    'hover:shadow-lg hover:-translate-y-1',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    'active:scale-[0.99]'
  ].join(' ') : '';

  const hoverClasses = hover ? 'hover:shadow-md hover:border-gray-300' : '';

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      ref={ref}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${interactiveClasses}
        ${hoverClasses}
        ${className}
      `}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

const CardHeader = forwardRef(({ 
  children, 
  className = '',
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`px-6 py-4 border-b border-gray-100 bg-gray-50/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef(({ 
  children, 
  className = '',
  as: Component = 'h3',
  ...props 
}, ref) => {
  return (
    <Component
      ref={ref}
      className={`text-lg font-semibold text-gray-900 leading-tight ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef(({ 
  children, 
  className = '',
  ...props 
}, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm text-gray-600 mt-1 leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef(({ 
  children, 
  className = '',
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`px-6 py-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({ 
  children, 
  className = '',
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`px-6 py-4 border-t border-gray-100 bg-gray-50/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
};


