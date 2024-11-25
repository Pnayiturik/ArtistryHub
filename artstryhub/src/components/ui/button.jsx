export const Button = ({ variant, size, children, className, ...props }) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md transition-all";

  const variants = {
    default: "bg-primary text-white hover:bg-primary-dark",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || ""} ${
        sizes[size] || ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
