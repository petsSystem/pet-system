import React from "react";

interface RadioCardProps {
  label: string;
  description: string;
  icon: JSX.Element;
  defaultChecked?: boolean;
  onClick?: () => void;
}

const RadioCard: React.FC<RadioCardProps> = ({
  label,
  description,
  icon,
  defaultChecked = false,
  onClick,
}) => {
  return (
    <label className="flex-1 relative block cursor-pointer">
      <input
        type="radio"
        name="radio-buttons"
        className="peer sr-only"
        defaultChecked={defaultChecked}
        onClick={onClick}
      />
      <div className="h-full text-center bg-white dark:bg-slate-800 px-4 py-6 rounded border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm duration-150 ease-in-out">
        <div className="inline-flex w-10 h-10 shrink-0 fill-current mb-2">
          {icon}
        </div>
        <div className="font-medium text-primary-600 dark:text-slate-100 mb-1">
          {label}
        </div>
        <div className="text-sm">{description}</div>
      </div>
      <div
        className="absolute inset-0 border-2 border-transparent peer-checked:border-primary-400 dark:peer-checked:border-primary-500 rounded pointer-events-none"
        aria-hidden="true"
      ></div>
    </label>
  );
};

export default RadioCard;
