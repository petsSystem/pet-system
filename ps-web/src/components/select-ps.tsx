import React from "react";
import { UseFormRegister } from "react-hook-form";

export type Option = {
  label: string;
  value: string | boolean;
};

interface SelectProps {
  id: string;
  label: string;
  options: Option[];
  value?: string | number | readonly string[]; // Alteração de defaultValue para value
  errors?: string | undefined;
  register: UseFormRegister<any>;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  id,
  register,
  label,
  options,
  value, // Alteração para value
  errors,
  disabled,
  ...rest
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label} <span className="text-rose-500">*</span>
      </label>
      <select
        id={id}
        {...register(id)} // Registro do campo com o React Hook Form
        value={value} // Alteração para usar a propriedade value
        className={`form-select w-full ${
          disabled
            ? "disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed"
            : ""
        }`}
        disabled={disabled}
        {...rest}
      >
        <option value="">Selecione</option>
        {options.map((option, index) => (
          <option key={index} value={option.value.toString()}>
            {option.label}
          </option>
        ))}
      </select>
      <div
        className={`text-xs mt-1 ${
          errors ? "text-rose-500" : ""
        } h-4 flex items-center`}
      >
        {errors || "\u00A0"}{" "}
      </div>
    </div>
  );
};

export default Select;
