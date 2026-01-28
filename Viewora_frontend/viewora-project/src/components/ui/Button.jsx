import { useNavigate } from "react-router-dom";

export default function Button({ 
  children, 
  variant = 'gold', 
  className = '', 
  onClick, 
  disabled,
  to,
  type = 'button'
}) {
  const navigate = useNavigate();

  const baseStyles = "px-5 py-2.5 rounded-md font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent";
  
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-secondary shadow-sm",
    secondary: "bg-white text-brand-primary border border-gray-300 hover:bg-gray-50 shadow-sm",
    ghost: "bg-transparent text-brand-primary hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  const handleClick = (e) => {
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
