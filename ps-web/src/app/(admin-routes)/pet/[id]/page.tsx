"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import { AppError } from "@utils/AppError";
import { useProfile } from "@hooks/useProfile";
import { useApp } from "@hooks/useApp";

import { validationSchema } from "./validationSchema";
import { api } from "@services/api";

import { zodResolver } from "@hookform/resolvers/zod";

import { getActionLabel, ActionType } from "@utils/getActionLabel";
import { useCompany } from "@/src/hooks/useCompany";
import { Input } from "@/src/components";
import CurrencyInput from "@/src/components/currency-input-ps/currency-input-ps";
import { useForm, SubmitHandler } from "react-hook-form";
import { toastPS } from "@/src/components/Toast";
import { UrlsEnum } from "@/src/enums";
import { Avatar } from "@/src/components";
import IconButton from "@/src/components/button-ps";
import ModalBasic from "@components/modal-basic";

import { extractNumbers } from "@utils/chars";
import { formatWithMask } from "@utils/mask";
import { PetDTO } from "@/src/dtos";
import Select, { Option } from "@/src/components/select-ps";
import Switch from "@/src/components/ps-switch";
import { convertCurrencyToNumber } from "@/src/utils/currency";
import { formatNumberToCurrency } from "@/src/utils/formatNumberToCurrency";

type Params = {
  id: string;
};

type ResponseDogs = {
  name: string;
  size: string;
};

interface FormInputs {
  id: string;
  customerId: string;
  name: string;
  color: string;
  gender: "MALE" | "FEMALE"; // Gênero só pode ser MALE ou FEMALE
  specie: string; // Espécie do animal (ex: DOG, CAT, etc.)
  birthDate: string; // Data de nascimento (no formato string)
  neutered: boolean; // Indica se o animal é castrado (true/false)
  temper: string; // Temperamento do animal
  coat: string; // Tipo de pelagem (ex: SHORT, LONG, etc.)
  weight: string; // Peso do animal
  breed: string; // Raça do animal
  size: "P" | "M" | "G"; // Tamanho do animal (P - Pequeno, M - Médio, G - Grande)
  active: boolean; // Indica se o animal está ativo (true/false)
}

const PetForm = () => {
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [dogs, setDogs] = useState<Option[]>([] as Option[]);

  const params: Params = useParams();
  const searchParams = useSearchParams();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();
  const route = useRouter();

  const { id: idParam } = params;
  const actionParam: string | null = searchParams.get("action");
  const customerIdParam: string | null = searchParams.get("customerId");
  const labelButton = getActionLabel(actionParam as ActionType);

  const { setIsLoading } = useApp();
  const [petData, setPetData] = useState<PetDTO | null>(null);

  const isView = actionParam === "view";

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(validationSchema),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await api.get<any>(`${UrlsEnum.PETS}/${idParam}`);
        setPetData(response.data);
      } catch (error: any) {
        console.error("Erro ao buscar dados do PET:", error);
        const isAppError = error instanceof AppError;
      } finally {
        setIsLoading(false);
      }
    }

    if (idParam !== "0") {
      fetchData();
    }
  }, [idParam]);

  useEffect(() => {
    async function fetchDataDogs() {
      try {
        const response = await api.get<any>(`/pets${UrlsEnum.DOGS}`);
        const responseDogs = response.data;
        const convertedData = responseDogs.map((item: any) => ({
          label: item,
          value: item,
        }));

        setDogs(convertedData);
      } catch (error: any) {
        console.error("Erro ao buscar dados do cliente:", error);
        const isAppError = error instanceof AppError;
      }
    }

    fetchDataDogs();
  }, [idParam]);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await api.patch<any>(`${UrlsEnum.PETS}/${idParam}`, [
        {
          op: "replace",
          path: "/active",
          value: false,
        },
      ]);
      handleBack();
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
    console.log(data);
    if (actionParam === "add") {
      const addUserData = {
        ...data,
        customerId: customerIdParam,
        neutered: Boolean(data.neutered),
        weight: convertCurrencyToNumber(data.weight),
        active: true,
      };
      try {
        setIsLoading(true);
        await api.post(`${UrlsEnum.PETS}`, addUserData);
        toastPS("Pet adicionado com sucesso", "success");
        route.back();
      } catch (errors: any) {
        console.log("error", errors);
        toastPS(errors.message, "error");
      } finally {
        setIsLoading(false);
      }
    } else if (actionParam === "edit") {
      const alterUserData = {
        ...data,
        neutered: Boolean(data.neutered),
        weight: convertCurrencyToNumber(data.weight),
      };
      console.log(alterUserData);
      try {
        setIsLoading(true);
        await api.put(`${UrlsEnum.PETS}/${idParam}`, alterUserData);
        toastPS("Pet alterado com sucesso", "success");
        route.back();
      } catch (error: any) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (petData) {
      reset({
        color: petData?.color,
        gender: petData?.gender,
        specie: petData?.specie,
        temper: petData?.temper.toString(),
        coat: petData?.coat.toString(),
        size: petData?.size,
        breed: petData?.breed.toString(),
        neutered: petData?.neutered,
      });
    }
  }, [petData, reset]);

  function handleBack() {
    route.back();
  }

  const optionsAnimalGender: Option[] = [
    { label: "Macho", value: "MALE" },
    { label: "Femea", value: "FEMALE" },
  ];

  const optionsAnimalType: Option[] = [{ label: "Cachorro", value: "DOG" }];
  const optionsAnimalNeutered: Option[] = [
    { label: "Sim", value: "true" },
    { label: "Não", value: "false" },
  ];
  const optionsAnimalTemper: Option[] = [
    { label: "Calmo", value: "EASY" },
    { label: "Agressivo", value: "AGGRESSIVE" },
  ];
  const optionsAnimalCoat: Option[] = [
    { label: "Curta", value: "SHORT" },
    { label: "Longa", value: "LONG" },
  ];
  const optionsAnimalSize: Option[] = [
    { label: "Pequeno", value: "P" },
    { label: "Médio", value: "M" },
    { label: "Grande", value: "G" },
    { label: "Muito grande", value: "GG" },
  ];
  return (
    <div className="relative bg-white-100 h-full">
      {(petData || actionParam === "add") && (
        <div className="px-4 sm:px-6 lg:px-4 py-2 w-full max-w-[96rem] mx-auto">
          <button
            onClick={handleBack}
            className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-indigo-400"
          >
            &lt;- Voltar para o cliente
          </button>
          <div className="space-y-8 ">
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl text-slate-500 font-bold mb-4">
                    Dados Gerais do PET
                  </h2>
                  {!isView && (
                    <button
                      type="button"
                      onClick={() => setCompanyModalOpen(true)}
                      className="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-rose-500"
                    >
                      <svg
                        className="w-4 h-4 fill-current shrink-0"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5 7h2v6H5V7zm4 0h2v6H9V7zm3-6v2h4v2h-1v10c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V5H0V3h4V1c0-.6.4-1 1-1h6c.6 0 1 .4 1 1zM6 2v1h4V2H6zm7 3H3v9h10V5z" />
                      </svg>
                      <span className="ml-2">Excluir PET</span>
                    </button>
                  )}
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  <Input
                    label="Nome:"
                    id="name"
                    defaultValue={petData?.name ?? ""}
                    register={register}
                    placeholder="Digite o nome do PET"
                    errors={errors.name?.message}
                    disabled={isView}
                  />
                  <Select
                    id="gender"
                    label="Gênero"
                    register={register}
                    options={optionsAnimalGender}
                    disabled={isView}
                  />
                  <Select
                    id="specie"
                    label="Especie"
                    register={register}
                    options={optionsAnimalType}
                    errors={errors.specie?.message}
                    disabled={isView}
                  />
                  <Select
                    id="neutered"
                    label="Castrado"
                    register={register}
                    options={optionsAnimalNeutered}
                    errors={errors.neutered?.message}
                    disabled={isView}
                  />
                  <Select
                    id="temper"
                    label="Temperamento"
                    register={register}
                    options={optionsAnimalTemper}
                    errors={errors.temper?.message}
                    disabled={isView}
                  />
                  <Select
                    id="coat"
                    label="Pelagem"
                    register={register}
                    options={optionsAnimalCoat}
                    errors={errors.coat?.message}
                    disabled={isView}
                  />
                  <Input
                    label="Cor:"
                    id="color"
                    defaultValue={petData?.color ?? ""}
                    register={register}
                    placeholder="Cor da pelagem"
                    errors={errors.color?.message}
                    disabled={isView}
                  />

                  <Select
                    id="size"
                    label="Porte"
                    register={register}
                    options={optionsAnimalSize}
                    errors={errors.size?.message}
                    disabled={isView}
                  />
                  <Input
                    label="Data nascimento:"
                    id="birthDate"
                    defaultValue={petData?.birthDate ?? ""}
                    placeholder="dd/mm/aaaa"
                    register={register}
                    errors={errors.birthDate?.message}
                    disabled={isView}
                    mask="99/99/9999"
                  />
                  <CurrencyInput
                    id="weight"
                    key="weight"
                    name="weight"
                    register={register}
                    label="Peso"
                    mask="currency"
                    prefix="KG"
                    placeholder="5,50"
                    disabled={isView}
                    defaultValue={formatNumberToCurrency(petData?.weight) ?? 0}
                  />
                  {dogs.length && (
                    <Select
                      id="breed"
                      label="Raça:"
                      register={register}
                      options={dogs}
                      errors={errors.breed?.message}
                      disabled={isView}
                    />
                  )}
                </div>

                <div className="flex justify-between mb-20 mt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-indigo-400"
                  >
                    &lt;- Voltar para o cliente
                  </button>
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
      <ModalBasic
        isOpen={companyModalOpen}
        setIsOpen={setCompanyModalOpen}
        title="Exclusão de PET:"
      >
        <div className="px-5 pt-4 pb-1">
          <div className="text-sm">
            <div className="mb-4">Tem certeza que deseja excluir o PET??</div>
          </div>
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-wrap justify-end space-x-4">
            <button
              type="button"
              className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 rounded-sm"
              onClick={() => setCompanyModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-sm bg-primary-500 hover:bg-primary-600 text-white p-1 rounded-sm"
              onClick={handleDelete}
            >
              Excluir
            </button>
          </div>
        </div>
      </ModalBasic>
    </div>
  );
};

export default PetForm;
