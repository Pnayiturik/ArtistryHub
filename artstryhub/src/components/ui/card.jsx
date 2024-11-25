// File: components/ui/card.js
import React from 'react';

export const Card = ({ children, className, ...props }) => (
  <div
    className={`bg-white rounded-lg shadow-md p-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h2 className={`text-lg font-bold text-gray-800 ${className}`} {...props}>
    {children}
  </h2>
);

export const CardDescription = ({ children, className, ...props }) => (
  <p className={`text-sm text-gray-600 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={`mt-4 ${className}`} {...props}>
    {children}
  </div>
);
