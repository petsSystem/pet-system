// components/Switch.tsx
import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  color: "red" | "green" | "yellow" | "orange";
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  color,
}) => {
  const getSwitchColorClass = () => {
    switch (color) {
      case "red":
        return "peer-checked:bg-red-600";
      case "green":
        return "peer-checked:bg-green-600";
      case "yellow":
        return "peer-checked:bg-yellow-500";
      case "orange":
        return "peer-checked:bg-orange-500";
      default:
        return "peer-checked:bg-blue-600";
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-${color}-300 dark:peer-focus:ring-${color}-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-${color}-600`}
        ></div>

        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {label}
        </span>
      </label>
    </div>
  );
};
