import React, { ButtonHTMLAttributes } from "react";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: "primary" | "secondary" | "tertiary" | "danger" | "success";
  size?: "xs" | "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  className,
  appearance = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  ...rest
}) => {
  const baseStyle =
    "btn flex items-center justify-center transition duration-300 ease-in-out rounded shadow-sm";

  const appearanceStyles = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white",
    secondary:
      "dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-primary-500",
    tertiary:
      "dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300",
    danger: "bg-rose-500 hover:bg-rose-600 text-white",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white",
  };

  const sizeStyles = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <button
      {...rest}
      className={`${baseStyle} ${appearanceStyles[appearance]} ${sizeStyles[size]} ${className}`}
      disabled={loading || rest.disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {loading ? (
        <svg className="animate-spin w-4 h-4 fill-current" viewBox="0 0 16 16">
          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

export default CustomButton;
