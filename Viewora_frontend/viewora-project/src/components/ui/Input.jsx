export default function Input({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = false,
  className = ""
}) {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-text-main">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="
          w-full 
          bg-white 
          border border-gray-300 
          text-text-main placeholder-gray-400
          rounded-md
          py-2.5 px-3
          focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent
          transition-shadow duration-200
          font-sans text-sm shadow-sm
        "
      />
    </div>
  );
}
