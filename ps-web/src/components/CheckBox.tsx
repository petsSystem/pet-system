// components/Checkbox.tsx
import React from "react";
import { UseFormRegister } from "react-hook-form";

interface CheckboxProps {
  name: string;
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  register: UseFormRegister<any>;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  register,
  name,
}) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        className="form-checkbox text-primary-500 focus:ring-primary-500 h-5 w-5"
        checked={checked}
        {...register(name)}
      />
      <span className="text-gray-800">{label}</span>
    </label>
  );
};

export default Checkbox;
