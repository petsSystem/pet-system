"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Switch from "@/src/components/ps-switch";
import IconButton from "@/src/components/button-ps";
import CheckBox from "@components/checkbox-ps";
import { Banner, Input } from "@/src/components";
import Select, { Option } from "@/src/components/select-ps";
import { toastPS } from "@/src/components/Toast";
import { UrlsEnum } from "@/src/enums";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";

import { useProfile } from "@hooks/useProfile";
import { useCompany } from "@/src/hooks/useCompany";
import { useApp } from "@/src/hooks/useApp";

import { getActionLabel, ActionType } from "./utils/getActionLabel";
import { validationSchema } from "./validationSchema";
import * as z from "zod";
import { extractNumbers } from "@utils/chars";
import { formatWithMask } from "@utils/mask";

import { UserDTO } from "@dtos/UserDTO";
import { CategoryDTO, TypeService, Weekday } from "@/src/dtos/CategoryDTO";
import { ProductDTO, ProfileRoleResponseDTO } from "@/src/dtos";
import { ScheduleDTO, ScheduleDayDTO } from "@/src/dtos/ScheduleDTO";
import {
  fetchScheduleById,
  createSchedule,
} from "@/src/services/schedules-service";
import { toArray } from "@/src/utils/arrayUtil";

type Params = {
  id: string;
};

interface FormInputs {
  active: boolean;
  productIds: string[];
  companyIds: string[];
  categoryId: string;
  userId: string;
  days: ScheduleDayDTO[];
}

interface ItemProductResponse {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  amount: number;
  additional: boolean;
  active: boolean;
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

type CategoryOption = {
  value: string | boolean;
  label: string;
};

const ScheduleForm = () => {
  const params: Params = useParams();
  const searchParams = useSearchParams();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();
  const route = useRouter();
  const { setIsLoading } = useApp();

  const { id } = params;
  const actionParam: string | null = searchParams.get("action");
  const userIdParam: string | null = searchParams.get("userId");
  const [categories, setCategories] = useState<CategoryOption[]>(
    [] as CategoryOption[]
  );

  const labelButton = getActionLabel(actionParam as ActionType);
  const selectedCompany = findSelectedCompanyById(profile?.companyId);

  const [profiles, setProfiles] = useState<ProfileRoleResponseDTO[]>([]);
  const [productsData, setProductsData] = useState<ItemProductResponse[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleDTO>(
    {} as ScheduleDTO
  );
  const [profileMsg, setProfileMsg] = useState<string>(
    "Nenhum perfil cadastrado"
  );

  const isView = actionParam === "view";

  const {
    reset,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(validationSchema),
  });
  // TODO - ADICIONAR VALIDAÇ˜AO
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [profilesResponse, categoriesResponse, productsResponse] =
          await Promise.all([
            api.get(`${UrlsEnum.PROFILES}`),
            api.get<CategoryDTO[]>(
              `${UrlsEnum.CATEGORIES}?companyId=${selectedCompany?.id}&active=true`
            ),
            api.get(`${UrlsEnum.PRODUCTS}?companyId=${selectedCompany?.id}`),
          ]);

        const responseCategories = categoriesResponse.data;
        const convertedData = responseCategories
          .filter((cat) => cat.active)
          .map((item: CategoryDTO) => ({
            label: item.label,
            value: item.id,
          }));

        setCategories(convertedData);
        setProfiles(profilesResponse.data.content);
        setProductsData(productsResponse.data.content);
      } catch (error: any) {
        const isAppError = error instanceof AppError;
        const title = isAppError
          ? error.message
          : "Não foi possível carregar os Dados";
        toastPS(title, "error");
      } finally {
        setIsLoading(false);
      }
    }
    if (selectedCompany?.id) {
      fetchData();
    }
  }, [selectedCompany?.id, setIsLoading]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const scheduleDataResponse = await fetchScheduleById(id);
        setScheduleData(scheduleDataResponse);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    if (id && categories) {
      fetchData();
    }
  }, [id, setIsLoading, categories]);

  const handleStateChange = async (isActive: boolean) => {
    try {
      setIsLoading(true);
      const response = await api.patch<any>(`${UrlsEnum.SCHEDULES}/${id}`, [
        {
          op: "replace",
          path: "/active",
          value: isActive,
        },
      ]);
      setScheduleData(response.data);
    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error?.message
        : "Não foi possível entrar. Tente novamente mais tarde";
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    const formtApiData = convertFormDataToApiFormat(data, selectedCompany!.id);

    if (actionParam === "add") {
      const addUserScheduleData = {
        ...formtApiData,
      };
      try {
        setIsLoading(true);
        await api.post(UrlsEnum.SCHEDULES, addUserScheduleData);
        toastPS("Usuário adicionado com sucesso", "success");
        route.push(`/user`);
      } catch (errors: any) {
        console.log("error", errors);
        toastPS(errors.message, "error");
      } finally {
        setIsLoading(false);
      }
    } else if (actionParam === "edit") {
      const alterUserData = {
        ...formtApiData,
      };
      try {
        setIsLoading(true);
        const response = await api.put(
          `${UrlsEnum.SCHEDULES}/${id}`,
          alterUserData
        );
        toastPS(" Agenda alterada com sucesso", "success");
        handleBack();
      } catch (error: any) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!!scheduleData) {
      reset({
        active: scheduleData.active,
        categoryId: scheduleData.categoryId,
        productIds: scheduleData.productIds,
        days: daysOfWeek?.map((day) => {
          const dAux = scheduleData?.days?.find(
            (d: ScheduleDayDTO) => d.weekday === day
          );
          return {
            weekday: dAux?.weekday ?? "",
            initialTime: dAux?.initialTime ?? "",
            endTime: dAux?.endTime ?? "",
            isOpen: !!dAux?.weekday,
          };
        }),
      });
    }
  }, [scheduleData, reset]);

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

  const convertFormDataToApiFormat = (
    formData: FormInputs,
    companyId: string
  ) => {
    const setWeekday = formData.days.map((day, index) => ({
      weekday: daysOfWeek[index],
      initialTime: day.isOpen ? day.initialTime : "",
      endTime: day.isOpen ? day.endTime : "",
      isOpen: day.isOpen,
    }));

    return {
      companyId: companyId,
      productIds: toArray(formData.productIds),
      categoryId: formData.categoryId,
      userId: userIdParam,
      days: setWeekday.filter((day) => day.isOpen),
    };
  };

  function handleBack() {
    route.back();
  }

  return (
    <div className="relative bg-white-100 h-full">
      {(scheduleData || actionParam === "add") && (
        <div className="px-4 sm:px-6 lg:px-4 py-2 w-full max-w-[96rem] mx-auto">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-start">
                <h2 className="text-2xl text-slate-500 font-bold mb-2">
                  Agenda e serviço do usuário
                </h2>
                {actionParam === "edit" && !scheduleData?.active && (
                  <Banner type="warning" open={true}>
                    Agenda deve estar ativa para alterações.
                  </Banner>
                )}
                {scheduleData?.active && (
                  <Switch
                    id="active"
                    initialChecked={scheduleData?.active}
                    labels={{ on: "Agenda Ativo", off: "Agenda Inativo" }}
                    onChange={handleStateChange}
                    disabled={isView || actionParam === "add"}
                  />
                )}
                {!scheduleData?.active && (
                  <Switch
                    id="active"
                    initialChecked={scheduleData?.active}
                    labels={{ on: "Agenda Ativo", off: "Agenda Inativo" }}
                    onChange={handleStateChange}
                    disabled={isView || actionParam === "add"}
                  />
                )}
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2 md:grid-cols-3">
                  {/* <Select
                    id="categoryId"
                    label="Categoria"
                    defaultValue={"86ee7583-a73f-4c02-912a-7675eaea229e"}
                    register={register}
                    options={categories}
                    errors={errors.categoryId?.message}
                    disabled={isView}
                  /> */}

                  <Select
                    id="categoryId"
                    label="Categoria:"
                    register={register}
                    options={categories}
                    errors={errors.categoryId?.message}
                    disabled={isView}
                  />
                </div>

                <h2 className="text-2xl text-slate-500 font-bold mb-2">
                  Serviços prestados
                </h2>

                <div className="grid gap-2 md:grid-cols-3" key="profileIds">
                  {productsData.length ? (
                    productsData?.map((product, id) => (
                      <div className="flex items-baseline" key={product.name}>
                        <CheckBox
                          id="productIds"
                          key={product.id}
                          label={product.name}
                          register={register}
                          value={product.id}
                          disabled={isView || !product?.active}
                        />
                        <span className="ml-1 text-xs text-red-300 font-bold mb-2">
                          {!product?.active && "(inativo)"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <Banner type="warning" open={true}>
                      {profileMsg}
                    </Banner>
                  )}
                </div>

                <div className="mt-8 grid grid-cols-1  gap-4">
                  <h2 className="text-2xl text-slate-500 font-bold ">
                    Horários de atendimento
                  </h2>
                  <div className="grid gap-2 md:grid-cols-3">
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
                              min="00:00"
                              max="23:59"
                              key={`days.${index}.initialTime` as const}
                              name={`days.${index}.initialTime` as const}
                              label="Inicial:"
                              id={`days.${index}.initialTime` as const}
                              register={register}
                              disabled={
                                !watch(`days.${index}.isOpen` as const) ||
                                isView
                              }
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
                              disabled={
                                !watch(`days.${index}.isOpen` as const) ||
                                isView
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleForm;
