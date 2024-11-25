export const Input = ({ placeholder, className, ...props }) => (
  <input
    type="text"
    placeholder={placeholder}
    className={`block w-full rounded-md border-gray-300 focus:ring-primary focus:border-primary ${className}`}
    {...props}
  />
);
