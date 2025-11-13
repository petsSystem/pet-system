import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonLabel?: ReactNode;
  icon?: ReactNode;
  onButtonClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary"; // Adicionando a propriedade de variante
}

const IconButton: React.FC<IconButtonProps> = ({
  buttonLabel,
  icon,
  onButtonClick,
  disabled = false,
  variant = "primary",
  ...buttonProps
}) => {
  return (
    <button
      className={`btn ${
        variant === "secondary"
          ? "dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-primary-500"
          : "bg-primary-500 hover:bg-primary-600 text-white"
      } ${
        disabled
          ? "disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed"
          : ""
      }`}
      onClick={onButtonClick}
      disabled={disabled}
      {...buttonProps}
    >
      {icon && (
        <svg
          className="w-4 h-4 fill-current opacity-50 shrink-0"
          viewBox="0 0 16 16"
        >
          {icon}
        </svg>
      )}
      {buttonLabel && (
        <span className="hidden lg:block ml-2">{buttonLabel}</span>
      )}
    </button>
  );
};

export default IconButton;
