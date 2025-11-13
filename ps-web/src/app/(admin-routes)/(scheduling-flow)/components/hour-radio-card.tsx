import React from "react";

interface RadioCardProps {
  label: string;
  icon?: JSX.Element;
  defaultChecked?: boolean;
  onClick?: () => void;
  disabled?: boolean; // Adicionando a propriedade disabled
}

const HourRadioCard: React.FC<RadioCardProps> = ({
  label,
  icon,
  defaultChecked = false,
  onClick,
  disabled = false, // Definindo o valor padrão como false
}) => {
  return (
    <label
      className={`flex-1 relative block cursor-pointer ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <input
        type="radio"
        name="radio-buttons"
        className="peer sr-only"
        defaultChecked={defaultChecked}
        onClick={onClick}
        disabled={disabled}
      />
      <div
        className={`h-full flex justify-center items-center bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-slate-600 shadow-sm duration-150 ease-in-out ${
          disabled
            ? "text-gray-500 dark:text-slate-400 cursor-not-allowed"
            : "text-slay-600 dark:text-slate-100 bg-white"
        } ${
          defaultChecked ? "border-primary-400 dark:border-primary-500" : ""
        }`}
      >
        <div
          className={`text-sm ${
            defaultChecked ? "text-primary-600 dark:text-primary-400" : ""
          }`}
        >
          {label}
        </div>
      </div>
      <div
        className="absolute inset-0 border-2 border-transparent peer-checked:border-primary-400 dark:peer-checked:border-primary-500 rounded pointer-events-none"
        aria-hidden="true"
      ></div>
    </label>
  );
};

export default HourRadioCard;
