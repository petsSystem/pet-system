import React from "react";
import { useForm } from "react-hook-form";

import FormField, { FieldProps } from "./FormField";

import { ButtonPS, Tabs } from "@components/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconList, IconStore } from "@components/icons";
import { TOption, TField } from "@interfaces/DynamicForm";

import { transformDataStructure } from "./dataTransform";

interface GenericFormProps<T, D> {
  id: string;
  formFields: TField[];
  onSubmit: (data: T, formId: string) => void;
  isLoading: boolean;
  validationSchema: any;
  defaultValues?: D;
  action?: "edit" | "delete" | "view" | null | string | boolean;
  labelButton?: string;
  secondaryAction?:
    | {
        checked: boolean;
        onChange: (checked: boolean) => void;
        onClick?: () => void;
        label: string;
        color: "red" | "green" | "yellow" | "orange";
        type?: "button" | "switch";
      }
    | undefined;
}

type GenericFormData = Record<
  string,
  string | boolean | Record<string, string>
>;

export const GenericForm: React.FC<GenericFormProps<any, any>> = ({
  id,
  formFields,
  onSubmit,
  isLoading,
  validationSchema,
  defaultValues,
  action,
  labelButton,
  secondaryAction,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleFormSubmit = (data: any) => {
    const trns = transformDataStructure(data, formFields);
    onSubmit(trns, id);
  };

  const tabs = formFields.map((field, index) => {
    return {
      label: field.label,
      icon: field.icon ?? IconStore,
      content: (
        <div className="grid gap-x-6 mb-4 md:grid-cols-2  w-full">
          {field.type === "form" ? (
            field.fields!.map((subField) => {
              return (
                <FormField
                  key={subField.name}
                  {...subField}
                  register={register}
                  errors={errors}
                  mask={subField.mask}
                  defaultValue={
                    defaultValues && field.index === 1
                      ? defaultValues[field?.name][subField?.name]
                      : defaultValues[subField?.name]
                  }
                  disabled={action === "view" || subField.disabled}
                  readonly={
                    (subField.readonly && action !== "add") ||
                    action === "delete"
                  }
                />
              );
            })
          ) : (
            <FormField
              key={field.name}
              {...field}
              register={register}
              errors={errors}
              defaultValue={""}
              disabled={action === "view"}
            />
          )}
        </div>
      ),
    };
  });

  return (
    <form
      key={id}
      onSubmit={handleSubmit((data) => handleFormSubmit(data))}
      className="w-full space-y-4 rounded"
    >
      <Tabs tabs={tabs} action={secondaryAction} />

      {action !== "view" && (
        <div className="flex justify-end">
          <span className="w-1/4">
            <ButtonPS
              type="submit"
              loading={isLoading}
              variant={action === "delete" ? "danger" : "default"}
            >
              {labelButton
                ? labelButton
                : action === "edit"
                ? "Atualizar"
                : "Excluir"}
            </ButtonPS>
          </span>
        </div>
      )}
    </form>
  );
};
