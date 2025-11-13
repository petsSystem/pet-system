"use client";
import React from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface Action {
  resource: string;
  actions: string[];
}

interface Role {
  id: string;
  name: string;
  permissions: Action[];
}

interface PermissionFormProps {
  onSubmit: SubmitHandler<FieldValues>;
  roles: Role[];
}

const PermissionForm: React.FC<PermissionFormProps> = ({ onSubmit, roles }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({});

  const handleRoleChange = (roleId: string) => {
    const selectedRole = roles.find((role) => role.id === roleId);

    if (selectedRole) {
      selectedRole.permissions.forEach((permission) => {
        setValue(`permissions.${permission.resource}`, true);
        permission.actions.forEach((action) => {
          setValue(`actions.${permission.resource}.${action}`, true);
        });
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {roles.map((role) => (
        <div key={role.id} className="mb-6">
          <input
            type="checkbox"
            id={role.id}
            {...register("id")}
            value={role.id}
          />
          <h2 className="text-2xl font-semibold mb-2">{role.name}</h2>
          {role.permissions.map((permission) => (
            <div key={permission.resource} className="mb-2 flex items-center">
              <label className="inline-block mr-2">{permission.resource}</label>
              <div className="ml-4 space-x-2">
                {permission.actions.map((action) => (
                  <div key={action} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      id={`${permission.resource}_${action}`}
                      {...register(`${permission.resource}_${action}`)}
                    />
                    <label
                      htmlFor={`${permission.resource}_${action}`}
                      className="ml-2"
                    >
                      {action}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Salvar
      </button>
    </form>
  );
};

export default PermissionForm;
