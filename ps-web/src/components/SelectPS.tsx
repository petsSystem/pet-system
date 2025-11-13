// components/SelectInput.tsx

import React from "react";
import { UseFormRegister } from "react-hook-form";

export type Option = {
  label: string;
  value: string;
};

interface SelectInputProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  options: Option[];
  disabled?: boolean;
  readonly?: boolean;
  errors?: any;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  register,
  options,
  disabled,
  readonly,
  errors,
}) => {
  return (
    <div className="mb-4">
      <label
        className={`mb-2 block font-medium text-black dark:text-white ${
          (disabled || readonly) && "disabled text-gray-400"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <select
          {...register(name)}
          className={`w-full py-4 pl-6 pr-10 bg-gray-50 outline-none rounded-md border focus:outline-none focus:border-primary-500  ${
            disabled || readonly
              ? "disabled text-gray-400"
              : "hover:border-primary-200"
          }`}
          style={{ appearance: "none" }}
          disabled={disabled || readonly}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </div>
      </div>
      <p className="text-red-500 text-xs mt-1 h-4 ">
        {/* {errors[name] && errors[name].message} */}
        {JSON.stringify(errors)}
      </p>
    </div>
  );
};

export default SelectInput;
