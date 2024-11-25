import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const clsx = (...classes) => classes.filter(Boolean).join(' ');

export const Sheet = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSheet = (state) => setIsOpen(state ?? !isOpen);

  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { toggleSheet, isOpen });
    }
    return child;
  });

  return <div>{enhancedChildren}</div>;
};

export const SheetTrigger = ({ children, toggleSheet }) => {
  return React.cloneElement(children, {
    onClick: () => toggleSheet(true),
  });
};

export const SheetContent = ({ children, toggleSheet, isOpen, side = 'right', className = '', ...props }) => {
  const sideClasses = {
    left: 'left-0 top-0 h-full',
    right: 'right-0 top-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full',
  };

  const portalRoot = document.getElementById('portal-root') || document.body;

  return createPortal(
    <div
      className={clsx(
        'fixed bg-white shadow-lg transform transition-transform',
        sideClasses[side],
        {
          'translate-x-0': isOpen && (side === 'left' || side === 'right'),
          '-translate-x-full': !isOpen && side === 'left',
          'translate-x-full': !isOpen && side === 'right',
          '-translate-y-full': !isOpen && side === 'top',
          'translate-y-full': !isOpen && side === 'bottom',
        },
        className
      )}
      {...props}
    >
      <div className="p-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={() => toggleSheet(false)}
        >
          Close
        </button>
        {children}
      </div>
      <div
        className={clsx(
          'fixed inset-0 bg-black bg-opacity-50 z-40',
          isOpen ? 'block' : 'hidden'
        )}
        onClick={() => toggleSheet(false)}
      />
    </div>,
    portalRoot
  );
};
