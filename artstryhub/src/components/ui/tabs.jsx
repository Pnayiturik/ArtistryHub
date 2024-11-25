import React, { useState } from 'react';

export const Tabs = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

export const TabsList = ({ children, className }) => (
  <div className={`flex ${className}`}>
    {children}
  </div>
);

export const TabsTrigger = ({ value, activeTab, setActiveTab, children, className }) => (
  <button
    className={`p-2 text-sm font-medium transition-colors rounded ${
      activeTab === value ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 text-gray-600'
    } ${className}`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

export const TabsContent = ({ value, activeTab, children }) => (
  activeTab === value ? <div className="mt-4">{children}</div> : null
);
