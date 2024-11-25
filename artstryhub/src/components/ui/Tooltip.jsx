import React, { useState } from 'react';

const Tooltip = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="relative inline-block"
    >
      {children(isOpen)}
    </div>
  );
};

export default Tooltip;
