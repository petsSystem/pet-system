import React, { useState } from "react";

interface SwitchProps {
  id: string;
  initialChecked?: boolean;
  labels?: { on: string; off: string };
  onChange?: (isActive: boolean) => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  id,
  initialChecked = false,
  labels = { on: "On", off: "Off" },
  onChange,
  disabled = false,
}) => {
  const [toggle, setToggle] = useState(initialChecked);

  const handleToggleChange = () => {
    if (!disabled) {
      setToggle(!toggle);
      if (onChange) {
        onChange(!toggle);
      }
    }
  };

  return (
    <div className="flex items-center">
      <div
        className={`form-switch ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <input
          type="checkbox"
          id={`switch-${id}`}
          className="sr-only"
          checked={toggle}
          onChange={handleToggleChange}
          disabled={disabled}
        />
        <label
          className={`bg-red-400 dark:bg-slate-700 ${
            disabled ? "cursor-not-allowed" : ""
          }`}
          htmlFor={`switch-${id}`}
        >
          <span className="bg-white shadow-sm" aria-hidden="true"></span>
          <span className="sr-only">Switch label</span>
        </label>
      </div>
      <div
        className={`text-sm ${
          disabled ? "text-gray-500" : "text-slate-400 dark:text-slate-500"
        } italic ml-2`}
      >
        {labels[toggle ? "on" : "off"]}
      </div>
    </div>
  );
};

export default Switch;
