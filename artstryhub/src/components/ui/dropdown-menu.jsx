import React from 'react';

export const DropdownMenu = ({ children }) => <div className="dropdown-menu">{children}</div>;
export const DropdownMenuContent = ({ children }) => <div className="dropdown-content">{children}</div>;
export const DropdownMenuItem = ({ children, onClick }) => (
  <div className="dropdown-item" onClick={onClick}>
    {children}
  </div>
);
export const DropdownMenuTrigger = ({ children }) => <button className="dropdown-trigger">{children}</button>;
