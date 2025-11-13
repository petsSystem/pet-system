import React, { InputHTMLAttributes, useCallback } from "react";
import { UseFormRegister } from "react-hook-form";

import { cep, currency, cpf } from "./masks";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  mask: "cep" | "currency" | "cpf";
  prefix?: string;
  register: UseFormRegister<any>;
  errors?: string | undefined;
  disabled?: boolean;
  label: string;
}

const CurrencyInput: React.FC<InputProps> = ({
  mask,
  prefix,
  register,
  id,
  errors,
  disabled,
  label,
  ...rest
}) => {
  const handleKeyUp = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (mask === "cep") {
        cep(e);
      }
      if (mask === "currency") {
        currency(e);
      }
      if (mask === "cpf") {
        cpf(e);
      }
    },
    [mask]
  );

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label} {errors && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <input
          disabled={disabled}
          className={`form-input w-full pl-12 ${
            errors ? "border-rose-300" : ""
          } ${
            disabled
              ? "disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed"
              : ""
          }`}
          onKeyUp={handleKeyUp}
          {...register(id)}
          {...rest}
        />
        <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
          <span className="text-sm text-slate-400 dark:text-slate-500 font-medium px-3">
            {prefix}
          </span>
        </div>
      </div>
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

export default CurrencyInput;
