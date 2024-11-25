import React from "react";

export const Alert = ({ children }) => (
  <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
    {children}
  </div>
);

export const AlertTitle = ({ children }) => (
  <h3 className="font-bold text-red-700">{children}</h3>
);

export const AlertDescription = ({ children }) => (
  <p className="text-sm text-red-600">{children}</p>
);
