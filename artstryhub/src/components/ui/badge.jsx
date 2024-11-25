export const Badge = ({ children, className }) => (
  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-md ${className}`}>
    {children}
  </span>
);
