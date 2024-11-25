import React from 'react';

export const Select = ({ value, onValueChange, children }) => (
  <div className="relative inline-block">
    {children}
  </div>
);

export const SelectTrigger = ({ children, className, ...props }) => (
  <button className={`flex items-center border rounded-md px-3 py-2 ${className}`} {...props}>
    {children}
  </button>
);

export const SelectValue = ({ placeholder }) => (
  <span className="text-gray-500">{placeholder}</span>
);

export const SelectContent = ({ children }) => (
  <div className="absolute left-0 w-full bg-white border rounded-md shadow-md mt-2">
    {children}
  </div>
);

export const SelectItem = ({ value, children, onClick }) => (
  <div
    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
    onClick={() => onClick(value)}
  >
    {children}
  </div>
);
