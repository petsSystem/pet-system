// components/FormField.tsx

import React from "react";
import { UseFormRegister } from "react-hook-form";

import { SelectPS, InputPS } from "@components/index";
import { TOption } from "@interfaces/DynamicForm";
import Checkbox from "@components/CheckBox";

export interface FieldProps {
  label: string;
  name: string;
  type: string;
  register: UseFormRegister<any>;
  options?: TOption[];
  checkbox?: any;
  errors: any;
  defaultValue: any;
  disabled?: boolean;
  readonly?: boolean;
  mask?: string;
}

const FormField: React.FC<FieldProps> = ({
  label,
  name,
  type,
  register,
  options,
  errors,
  defaultValue,
  disabled,
  readonly,
  mask,
  checkbox,
  ...rest
}) => {
  return (
    <div>
      {type === "select" ? (
        <SelectPS
          key={name}
          label={label}
          name={name}
          register={register}
          options={options || []}
          disabled={disabled}
          readonly={readonly}
          {...rest}
        />
      ) : type === "checkbox" ? (
        <div className="flex items-center mb-4 w-full bg-red-100">
          <Checkbox
            name={name}
            key={checkbox!.key}
            label={checkbox.label}
            checked={defaultValue}
            register={register}
          />
        </div>
      ) : (
        <InputPS
          key={name}
          name={name}
          label={label}
          id={name}
          type={type}
          register={register}
          errors={errors}
          defaultValue={defaultValue}
          disabled={disabled}
          readonly={readonly}
          mask={mask}
          {...rest}
        />
      )}
    </div>
  );
};

export default FormField;
