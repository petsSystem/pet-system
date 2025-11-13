// components/Checkbox.tsx
import React from "react";

interface CheckboxProps {
  label: string;
}

const CheckboxColor: React.FC<CheckboxProps> = ({ label }) => {
  return (
    <ul className="mb-4">
      <li className="py-1 px-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox visually-hidden w-4 h-4 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-full transition duration-150 ease-in-out"
          />
          <div className="w-4 h-4 bg-white dark:bg-slate-900/30 border focus:ring-0 focus:ring-offset-0 dark:disabled:bg-slate-700/30 dark:disabled:border-slate-700 dark:disabled:hover:border-slate-700 checked:bg-primary-500 dark:checked:border-transparent border-slate-300 focus:border-primary-300 dark:border-slate-700 dark:focus:border-primary-500/50"></div>
          <span className="text-sm font-medium ml-2">{label}</span>
        </label>
      </li>
    </ul>
  );
};

export default CheckboxColor;
