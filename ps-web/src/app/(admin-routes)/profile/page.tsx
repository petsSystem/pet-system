"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

import { AppError } from "@utils/AppError";
import { useProfile } from "@hooks/useProfile";

import { validationSchema } from "./validationSchema";
import ModalBasic from "@components/modal-basic";
import UserPassword from "./components/UserPassword";
import { api } from "@services/api";

import { zodResolver } from "@hookform/resolvers/zod";

import { getActionLabel, ActionType } from "@utils/getActionLabel";
import { useCompany } from "@/src/hooks/useCompany";
import { useForm, SubmitHandler } from "react-hook-form";
import { useApp } from "@/src/hooks/useApp";

import { toastPS } from "@/src/components/Toast";
import { UrlsEnum } from "@/src/enums";
import { Input } from "@/src/components";
import IconButton from "@/src/components/button-ps";
import { UserProfileDTO } from "@/src/dtos";
import Select, { Option } from "@/src/components/select-ps";

import { extractNumbers } from "@utils/chars";
import { PetDTO } from "@/src/dtos";

type Params = {
  id: string;
};

interface FormInputs {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
  origin: "SYS" | "APP";
  appStatus: "PENDING" | "INACTIVE" | "ACTIVE";
  active: boolean;
  companyIds: string[];
  address: {
    postalCode: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    lat: number;
    lon: number;
  };
  username: string;
  changePassword: boolean;
  role: "USER" | "ADMIN" | "MANAGER";
}

const ProfileForm = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const params: Params = useParams();
  const searchParams = useSearchParams();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();

  const { id: idParam } = params;
  const actionParam: string | null = searchParams.get("action");
  const labelButton = getActionLabel("edit");

  const { setIsLoading } = useApp();
  const [userProfileData, setUserProfileData] = useState<UserProfileDTO | null>(
    null
  );
  const [petsData, setPetsData] = useState<PetDTO[] | null>([]);

  const isView = actionParam === "view";

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(validationSchema),
    defaultValues: {},
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await api.get<any>(`${UrlsEnum.USER_PROFILE}`);
        setUserProfileData(response.data);
      } catch (error: any) {
        console.error("Erro ao buscar dados do cliente:", error);
        const isAppError = error instanceof AppError;
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [idParam]);

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    const updateUserData = {
      name: data.name,
      email: data.email,
      phone: extractNumbers(data.phone),
      address: {
        ...data.address,
        postalCode: extractNumbers(data.address.postalCode),
        number: extractNumbers(data.address.number),
        lat: -23.684989159899636,
        lon: -46.53484196947442,
      },
    };
    try {
      setIsLoading(true);
      await api.put(`${UrlsEnum.USERS}/profile`, updateUserData);
      toastPS("Informações atualizadas com sucesso", "success");
    } catch (errors: any) {
      console.log("error", errors);
      toastPS(errors.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-white-100 h-full">
      {(userProfileData || actionParam === "add") && (
        <div className="px-4 sm:px-6 lg:px-4 py-2 w-full max-w-[96rem] mx-auto">
          <div className="space-y-8 ">
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl text-slate-500 font-bold mb-4">
                    Dados Gerais
                  </h2>
                  <button
                    type="button"
                    onClick={() => setModalOpen(!modalOpen)}
                    className="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-rose-500"
                  >
                    Alterar senha
                  </button>
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  <Input
                    label="Nome:"
                    id="name"
                    defaultValue={userProfileData?.name ?? ""}
                    register={register}
                    placeholder="Digite seu nome"
                    errors={errors.name?.message}
                    disabled={isView}
                  />
                  <Input
                    label="CPF:"
                    id="cpf"
                    defaultValue={userProfileData?.cpf ?? ""}
                    placeholder="Digite seu cpf"
                    register={register}
                    errors={errors.cpf?.message}
                    disabled={true}
                    mask={"999.999.999-99"}
                  />
                  <Input
                    label="E-mail:"
                    id="email"
                    defaultValue={userProfileData?.email ?? ""}
                    placeholder="Digite seu email"
                    register={register}
                    errors={errors.email?.message}
                    disabled={isView}
                  />
                  <Input
                    label="Telefone:"
                    id="phone"
                    defaultValue={userProfileData?.phone ?? ""}
                    placeholder="Digite o telefone"
                    register={register}
                    errors={errors.phone?.message}
                    disabled={isView}
                    mask={"(99)99999-9999"}
                  />
                </div>
                <h2 className="text-2xl text-slate-500 font-bold mb-4">
                  Endereço
                </h2>
                <div className="grid gap-2 md:grid-cols-3">
                  <Input
                    label="CEP:"
                    id="address.postalCode"
                    defaultValue={userProfileData?.address?.postalCode ?? ""}
                    placeholder="Digite seu CEP"
                    register={register}
                    errors={errors.address?.postalCode?.message}
                    disabled={isView}
                    mask={"99999-999"}
                  />
                  <Input
                    label="Rua:"
                    id="address.street"
                    defaultValue={userProfileData?.address?.street ?? ""}
                    placeholder="Nome da rua"
                    register={register}
                    errors={errors.address?.street?.message}
                    disabled={isView}
                  />
                  <Input
                    label="Número:"
                    id="address.number"
                    defaultValue={userProfileData?.address?.number ?? ""}
                    placeholder="Digite o número"
                    register={register}
                    errors={errors.address?.number?.message}
                    disabled={isView}
                    mask={"99999"}
                  />
                  <Input
                    label="Bairro:"
                    id="address.neighborhood"
                    defaultValue={userProfileData?.address?.neighborhood ?? ""}
                    placeholder="Digite o bairro"
                    register={register}
                    errors={errors.address?.neighborhood?.message}
                    disabled={isView}
                  />
                  <Input
                    label="Cidade:"
                    id="address.city"
                    defaultValue={userProfileData?.address?.city ?? ""}
                    placeholder="Digite sua cidade"
                    register={register}
                    errors={errors.address?.city?.message}
                    disabled={isView}
                  />
                  <Input
                    label="Estado:"
                    id="address.state"
                    defaultValue={userProfileData?.address?.state ?? ""}
                    placeholder="Digite seu estado"
                    register={register}
                    errors={errors.address?.state?.message}
                    disabled={isView}
                  />
                  <Select
                    id="address.country"
                    label="País:"
                    register={register}
                    options={[{ label: "Brasil", value: "Brasil" }]}
                    value="Brasil"
                    errors={errors.address?.country?.message}
                    disabled={isView}
                  />
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
      <ModalBasic
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        title="Alteração de senha:"
      >
        <div className="w-full justify-center p-8">
          <UserPassword setIsOpen={setModalOpen} />
        </div>
      </ModalBasic>
    </div>
  );
};

export default ProfileForm;
