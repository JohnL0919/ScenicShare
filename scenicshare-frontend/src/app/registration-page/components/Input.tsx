import React from "react";

type InputProps = {
  label: string;
  className?: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  icon?: React.ReactNode;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
};

const Input: React.FC<InputProps> = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  className = "",
  icon,
  type = "text",
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm mb-1">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center opacity-60">
            {icon}
          </span>
        )}
        <input
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          placeholder={placeholder || ""}
          className={`w-full rounded-md border-gray-400 border ${
            icon ? "pl-10" : "px-3"
          } pr-3 py-2 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        />
      </div>
    </div>
  );
};

export default Input;
