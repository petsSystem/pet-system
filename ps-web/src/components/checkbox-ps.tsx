import React, { HTMLProps } from "react";

import { UseFormRegister, FieldValues } from "react-hook-form";

interface CheckboxProps extends HTMLProps<HTMLInputElement> {
  id: string;
  label: string;
  register: UseFormRegister<any>;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  register,
  ...props
}) => {
  return (
    <label htmlFor={id} className="flex items-center">
      <input
        id={id}
        type="checkbox"
        className="form-checkbox accent-primary-700"
        {...register(id)}
        {...props}
      />
      <span className="text-sm ml-2">{label}</span>
    </label>
  );
};

export default Checkbox;
