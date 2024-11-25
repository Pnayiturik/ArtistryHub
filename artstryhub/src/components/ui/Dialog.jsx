import React from 'react';

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">{children}</div>
      <div
        className="fixed inset-0 z-40"
        onClick={() => onOpenChange(false)}
      ></div>
    </div>
  );
};

export const DialogTrigger = ({ children, asChild, ...props }) => (
  React.cloneElement(children, {
    ...props,
    onClick: (e) => {
      if (children.props.onClick) children.props.onClick(e);
      props.onOpenChange(true);
    },
  })
);

export const DialogContent = ({ children }) => (
  <div className="space-y-4">{children}</div>
);

export const DialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h3 className="text-lg font-bold">{children}</h3>
);

export const DialogDescription = ({ children }) => (
  <p className="text-gray-500">{children}</p>
);

export const DialogFooter = ({ children }) => (
  <div className="mt-4 flex justify-end gap-2">{children}</div>
);

export const DialogClose = ({ children, asChild, onClose }) => 
  React.cloneElement(children, {
    onClick: (e) => {
      if (children.props.onClick) children.props.onClick(e);
      onClose();
    },
  });
