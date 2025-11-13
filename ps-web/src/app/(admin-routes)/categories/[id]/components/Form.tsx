"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { CategoryDTO, TypeService, Weekday } from "@/src/dtos/CategoryDTO";
import { useCompany } from "@/src/hooks/useCompany";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useProfile } from "@/src/hooks/useProfile";
import { validationSchema } from "./validationCategory";
import { yupResolver } from "@hookform/resolvers/yup";
import { ButtonPS, InputPS, Input } from "@/src/components";
import * as Yup from "yup";
import Switch from "@/src/components/ps-switch";
import IconButton from "@/src/components/button-ps";
import { getActionLabel, ActionType } from "@utils/getActionLabel";

interface DayData {
  weekday: Weekday;
  isOpen?: boolean;
  initialTime: string;
  endTime: string;
  simultaneous: string | number;
  intervalMinutes: string;
}

interface FormData {
  type: TypeService;
  label: string;
  description: string;
  // days: DayData[];
}

const daysOfWeek: Weekday[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const convertToPortuguese = (day: Weekday): string => {
  const translationMap: Record<Weekday, string> = {
    SUNDAY: "Domigo",
    MONDAY: "Segunda",
    TUESDAY: "Terça",
    WEDNESDAY: "Quarta",
    THURSDAY: "Quinta",
    FRIDAY: "Sexta",
    SATURDAY: "Sábado",
  };

  return translationMap[day];
};

const convertFormDataToApiFormat = (formData: FormData, companyId: string) => {
  return {
    companyId: companyId,
    type: formData.type,
    label: formData.label,
    description: formData.description,
    // days: formData.days
    //   .filter((day) => day.isOpen)
    //   .map((day, index) => ({
    //     weekday: day.isOpen ? day.weekday : daysOfWeek[index],
    //     initialTime: day.isOpen ? day.initialTime : "",
    //     endTime: day.isOpen ? day.endTime : "",
    //     simultaneous: day.simultaneous,
    //     intervalMinutes: day.intervalMinutes,
    //   })),
  };
};

interface TimesProps {
  onSubmit: Function;
  data?: CategoryDTO;
  isView?: boolean;
  switchChange?: (isActive: boolean) => void;
}
export type FormState = Yup.InferType<typeof validationSchema>;

const CategoryForm = ({
  onSubmit,
  switchChange,
  data,
  isView = false,
}: TimesProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { findSelectedCompanyById } = useCompany();
  const searchParams = useSearchParams();
  const { profile } = useProfile();

  const selectedCompany = findSelectedCompanyById(profile?.companyId);
  const actionParam: string | null = searchParams.get("action");
  const labelButton = getActionLabel(actionParam as ActionType);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      type: undefined,
      description: "",
      days: daysOfWeek.map((day) => ({
        weekday: day,
        isOpen: false,
        initialTime: "09:00",
        endTime: "18:00",
        simultaneous: "1",
        intervalMinutes: "30",
      })),
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        label: data.label,
        description: data.description,
        // days: daysOfWeek.map((day) => {
        //   const dAux = data.days.find((d) => d.weekday === day);
        //   return {
        //     weekday: dAux?.weekday ?? day,
        //     isOpen: !!dAux?.weekday,
        //     initialTime: dAux?.initialTime ?? "",
        //     endTime: dAux?.endTime ?? "",
        //     simultaneous: dAux?.simultaneous ?? "1",
        //     intervalMinutes: dAux?.intervalMinutes.toString() ?? "30",
        //   };
        // }),
      });
    }
  }, [data, reset]);

  const onHandleSubmit: SubmitHandler<FormData> = (data) => {
    const apiData = convertFormDataToApiFormat(data, selectedCompany!.id);
    onSubmit(apiData);
  };

  return (
    <div className="p-6  rounded-md">
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <div className="flex justify-between items-start">
          <h2 className="text-2xl text-slate-500 font-bold mb-4">
            Dados Gerais
          </h2>
          <Switch
            id="active"
            initialChecked={!!data?.active}
            labels={{ on: "Categoria Ativa", off: "Categoria Inativa" }}
            onChange={switchChange}
            disabled={isView}
          />
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          <Input
            key="label"
            name="label"
            label="Tipo da Categoria"
            id="label"
            type="text"
            register={register}
            disabled={true}
          />
          <Input
            key="description"
            name="description"
            label="Descrição"
            id="description"
            type="text"
            register={register}
            disabled={isView}
          />
        </div>
        {/* <div className="mt-6 grid grid-cols-1  gap-4">
          <h2 className="text-2xl text-slate-500 font-bold mb-4">
            Horários de Funcionamento
          </h2>
          {daysOfWeek.map((day, index) => (
            <div key={index} className="mb-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register(`days.${index}.isOpen` as const)}
                  className="border-primary-700  checked:bg-primary-500  appearance-auto accent-primary-700 mr-2 form-checkbox visually-hidden w-4 h-4  border border-slate-200 rounded-full transition duration-150 ease-in-out"
                  disabled={isView}
                />
                <span className="block text-md font-medium mb-1">
                  {convertToPortuguese(day)}
                </span>
              </div>
              <input
                type="text"
                {...register(`days.${index}.weekday` as const)}
                className="w-full border p-2 mb-4 rounded-md hidden"
                defaultValue={day}
                disabled={isView}
              />
              <div className="flex mt-6   gap-2 items-end">
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    key={`days.${index}.initialTime` as const}
                    name={`days.${index}.initialTime` as const}
                    label="Inicial:"
                    id={`days.${index}.initialTime` as const}
                    register={register}
                    disabled={!watch(`days.${index}.isOpen` as const) || isView}
                    defaultValue={day}
                  />
                  <span className="text-gray-500 ">até</span>
                  <Input
                    type="time"
                    key={`days.${index}.endTime` as const}
                    name={`days.${index}.endTime` as const}
                    label="Final:"
                    id={`days.${index}.endTime` as const}
                    register={register}
                    disabled={!watch(`days.${index}.isOpen` as const) || isView}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    key={`days.${index}.simultaneous` as const}
                    name={`days.${index}.simultaneous` as const}
                    label="Simultâneo:"
                    id={`days.${index}.simultaneous` as const}
                    register={register}
                    disabled={!watch(`days.${index}.isOpen` as const) || isView}
                  />
                  <Input
                    type="number"
                    key={`days.${index}.intervalMinutes` as const}
                    name={`days.${index}.intervalMinutes` as const}
                    label="Intervalo (minutos):"
                    id={`days.${index}.intervalMinutes` as const}
                    register={register}
                    disabled={!watch(`days.${index}.isOpen` as const) || isView}
                  />
                </div>
              </div>
            </div>
          ))}
        </div> */}

        {!isView && (
          <div className="flex justify-end mb-10">
            <IconButton
              type="submit"
              buttonLabel={labelButton}
              disabled={isView}
              icon={
                <path d="M14.3 2.3L5 11.6 1.7 8.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4 4c.2.2.4.3.7.3.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z" />
              }
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default CategoryForm;
