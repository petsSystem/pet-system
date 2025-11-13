import React, { FC, InputHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";
import InputMask from "react-input-mask";
import Tooltip from "./tooltip";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  register: UseFormRegister<any>;
  errors?: string | undefined;
  disabled?: boolean;
  mask?: string; // Adicione a propriedade mask
  tooltipMessage?: string;
}

const Input: FC<InputProps> = ({
  label,
  id,
  register,
  errors,
  disabled,
  mask, // Adicione a propriedade mask
  tooltipMessage,
  ...rest
}) => {
  const InputElement = mask ? InputMask : "input";
  const maskCharProp = mask ? { maskChar: null } : {};

  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium mb-1">
          {label} {errors && <span className="text-rose-500">*</span>}
        </label>
        {tooltipMessage && (
          <Tooltip className="ml-2" bg="primary" size="md">
            <div className="text-sm text-slate-200">{tooltipMessage}</div>
          </Tooltip>
        )}
      </div>
      {mask ? (
        <InputElement
          className={`form-input w-full ${errors ? "border-rose-300" : ""} ${
            disabled
              ? "disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed"
              : ""
          }`}
          {...register(id)}
          mask={mask}
          {...maskCharProp}
          {...rest}
          disabled={disabled}
        />
      ) : (
        <input
          className={`form-input w-full ${errors ? "border-rose-300" : ""} ${
            disabled
              ? "disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed"
              : ""
          }`}
          {...register(id)}
          {...rest}
          disabled={disabled}
        />
      )}
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

export default Input;
