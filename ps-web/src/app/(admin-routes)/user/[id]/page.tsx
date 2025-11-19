"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Switch from "@/src/components/ps-switch";
import IconButton from "@/src/components/button-ps";
import CheckBox from "@components/checkbox-ps";
import { Banner, Input, Avatar } from "@/src/components";
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
import { ProductDTO, ProfileRoleResponseDTO } from "@/src/dtos";
import { ScheduleDTO } from "@/src/dtos/ScheduleDTO";

import Select, { Option } from "@/src/components/select-ps";

type Params = {
  id: string;
};

interface ScheduleResponse {
  active: boolean;
  companyId: string;
  id: string;
  name: string;
  userId: string;
}

interface FormInputs {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  profileIds: string[];
  productIds: string[];
  companyIds: string[];
  address: {
    postalCode: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    lat?: number;
    lon?: number;
  };
}

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
});

const UserForm = () => {
  const params: Params = useParams();
  const searchParams = useSearchParams();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();
  const route = useRouter();

  const { id } = params;
  const actionParam: string | null = searchParams.get("action");
  const companyIdParam: string | null = searchParams.get("companyId");
  const roleParam: string | null = searchParams.get("role");
  const labelButton = getActionLabel(actionParam as ActionType);
  const selectedCompany = findSelectedCompanyById(profile?.companyId);
  const isCreatingOwner = roleParam === "OWNER" && companyIdParam;

  const [profiles, setProfiles] = useState<ProfileRoleResponseDTO[]>([]);
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const { setIsLoading } = useApp();
  const [userData, setUserData] = useState<UserDTO | null>(null);
  const [profileMsg, setProfileMsg] = useState<string>(
    "Nenhum perfil cadastrado"
  );

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
        const response = await api.get<any>(`/users/${id}`);
        const formatedUser = formatUserData(response.data);

        setUserData(formatedUser);
      } catch (error: any) {
        console.error("Erro ao buscar dados do usuário:", error);
        const isAppError = error instanceof AppError;
      }
    }

    if (id !== "0") {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [profilesResponse] = await Promise.all([
          api.get(`${UrlsEnum.PROFILES}`),
        ]);
        setProfiles(profilesResponse.data.content);
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
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [scheduleResponse] = await Promise.all([
          api.get(
            `${UrlsEnum.SCHEDULES}?companyId=${selectedCompany?.id}&userId=${id}`
          ),
        ]);
        setSchedules(scheduleResponse.data);
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
    if (actionParam !== "add") {
      fetchData();
    }
  }, [selectedCompany?.id]);

  const formatUserData = (data: UserDTO) => {
    return {
      name: data.name,
      cpf: formatWithMask(data.cpf, "999.999.999-00"),
      email: data.email,
      phone: data.phone,
      profileIds: data.profileIds,
      productIds: data.productIds,
      companyIds: data.companyIds,
      active: data.active,
      address: {
        postalCode: formatWithMask(data.address.postalCode, "99999-999"),
        street: data.address.street,
        number: data.address.number,
        neighborhood: data.address.neighborhood,
        city: data.address.city,
        state: data.address.state,
        country: data.address.country,
        lat: 0,
        lon: 0,
      },
    };
  };

  const handleStateUserChange = async (isActive: boolean) => {
    try {
      setIsLoading(true);
      const response = await api.patch<any>(`${UrlsEnum.USERS}/${id}`, [
        {
          op: "replace",
          path: "/active",
          value: isActive,
        },
      ]);
      setUserData(response.data);
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
    if (actionParam === "add") {
      // Se está criando OWNER, buscar o perfil OWNER automaticamente
      let profileIds = data.profileIds;
      if (isCreatingOwner) {
        const ownerProfile = profiles.find(p => p.role === "OWNER");
        if (ownerProfile) {
          profileIds = [ownerProfile.id];
        }
      }
      
      const addUserData = {
        ...data,
        cpf: extractNumbers(data.cpf),
        phone: extractNumbers(data.phone),
        profileIds: profileIds,
        companyIds: isCreatingOwner ? [companyIdParam] : [selectedCompany?.id],
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
        await api.post(UrlsEnum.USERS, addUserData);
        const successMessage = isCreatingOwner 
          ? "Proprietário criado com sucesso! Senha padrão: 123456" 
          : "Usuário adicionado com sucesso";
        toastPS(successMessage, "success");
        route.push(isCreatingOwner ? `/companies` : `/user`);
      } catch (errors: any) {
        toastPS(errors.message, "error");
      } finally {
        setIsLoading(false);
      }
    } else if (actionParam === "edit") {
      const alterUserData = {
        ...data,
        cpf: extractNumbers(data.cpf),
        phone: extractNumbers(data.phone),
        companyIds: [selectedCompany?.id],
        productIds: data.productIds,
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
        const response = await api.put(
          `${UrlsEnum.USERS}/${id}`,
          alterUserData
        );
        toastPS("Usuário alterado com sucesso", "success");
        route.push(`/user`);
      } catch (error: any) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (userData) {
      reset({
        profileIds: userData.profileIds,
        productIds: userData.productIds,
      });
    }
  }, [userData, reset]);

  function handleActionSchedule(scheduleId: string, action: string) {
    route.push(`/schedule/${scheduleId}?action=${action}&userId=${id}`);
  }

  return (
    <div className="relative bg-white-100 h-full">
      {(userData || actionParam === "add") && (
        <div className="px-4 sm:px-6 lg:px-4 py-2 w-full max-w-[96rem] mx-auto">
          <div className="space-y-8">
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl text-slate-500 font-bold mb-2">
                    {isCreatingOwner ? "Novo Proprietário" : "Dados Gerais"}
                  </h2>
                  {actionParam === "edit" && !userData?.active && (
                    <Banner type="warning" open={true}>
                      Usuário deve estar ativo para alterações.
                    </Banner>
                  )}
                  <Switch
                    id="exemplo"
                    initialChecked={!!userData?.active}
                    labels={{ on: "Usuário Ativo", off: "Usuário Inativo" }}
                    onChange={handleStateUserChange}
                    disabled={isView || actionParam === "add"}
                  />
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  <Input
                    label="Nome:"
                    id="name"
                    defaultValue={userData?.name ?? ""}
                    register={register}
                    placeholder="Digite seu nome"
                    errors={errors.name?.message}
                    disabled={isView}
                  />
                  <Input
                    label="CPF:"
                    id="cpf"
                    defaultValue={userData?.cpf ?? ""}
                    placeholder="Digite seu cpf"
                    register={register}
                    errors={errors.cpf?.message}
                    disabled={isView || actionParam === "edit"}
                    mask={"999.999.999-99"}
                  />
                  <Input
                    label="E-mail:"
                    id="email"
                    placeholder="Digite seu email"
                    register={register}
                    errors={errors.email?.message}
                    disabled={isView}
                    defaultValue={userData?.email ?? ""}
                  />
                  <Input
                    label="Telefone:"
                    id="phone"
                    placeholder="Digite o telefone"
                    {...register("phone")}
                    register={register}
                    errors={errors.phone?.message}
                    disabled={isView}
                    mask={"(99)99999-9999"}
                    defaultValue={userData?.phone ?? ""}
                  />
                </div>
                <h2 className="text-2xl text-slate-500 font-bold mb-2">
                  Endereço
                </h2>
                <div className="grid gap-2 md:grid-cols-3">
                  <Input
                    label="CEP:"
                    id="address.postalCode"
                    defaultValue={userData?.address?.postalCode ?? ""}
                    placeholder="Digite seu CEP"
                    {...register("address.postalCode")}
                    register={register}
                    errors={errors.address?.postalCode?.message}
                    disabled={isView}
                    mask={"99999-999"}
                  />
                  <Input
                    label="Rua:"
                    id="address.street"
                    defaultValue={userData?.address?.street ?? ""}
                    placeholder="Nome da rua"
                    {...register("address.street")}
                    register={register}
                    errors={errors.address?.street?.message}
                    disabled={isView}
                  />
                  <Input
                    label="Número:"
                    id="address.number"
                    defaultValue={userData?.address?.number ?? ""}
                    placeholder="Digite o número"
                    {...register("address.number")}
                    register={register}
                    errors={errors.address?.number?.message}
                    disabled={isView}
                    mask={"99999"}
                  />
                  <Input
                    label="Bairro:"
                    id="address.neighborhood"
                    defaultValue={userData?.address?.neighborhood ?? ""}
                    placeholder="Digite o bairro"
                    {...register("address.neighborhood")}
                    register={register}
                    errors={errors.address?.neighborhood?.message}
                    disabled={isView}
                  />
                  <Input
                    label="Cidade:"
                    id="address.city"
                    defaultValue={userData?.address?.city ?? ""}
                    placeholder="Digite sua cidade"
                    {...register("address.city")}
                    register={register}
                    errors={errors.address?.city?.message}
                    disabled={isView}
                  />
                  <Input
                    label="Estado:"
                    id="address.state"
                    defaultValue={userData?.address?.state ?? ""}
                    placeholder="Digite seu estado"
                    {...register("address.state")}
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
                {!isCreatingOwner && (
                  <>
                    <h2 className="text-2xl text-slate-500 font-bold mb-2">
                      Perfil de acesso
                    </h2>
                    <div className="grid gap-2 md:grid-cols-3" key="profileIds">
                      {profiles.length ? (
                        profiles?.map((role, id) => (
                          <CheckBox
                            id="profileIds"
                            key={id}
                            label={role.name}
                            register={register}
                            value={role.id}
                            disabled={isView}
                          />
                        ))
                      ) : (
                        <Banner type="warning" open={true}>
                          {profileMsg}
                        </Banner>
                      )}
                    </div>
                  </>
                )}
                
                {isCreatingOwner && (
                  <div className="mb-4">
                    <Banner type="info" open={true}>
                      🏢 Este usuário será criado como PROPRIETÁRIO da empresa selecionada.<br/>
                      🔑 Senha padrão: <strong>123456</strong> (deve ser alterada no primeiro login)
                    </Banner>
                  </div>
                )}

                <h2 className="text-2xl text-slate-500 font-bold mb-4 mt-4">
                  Agenda
                </h2>

                <div className="flex gap-6  ">
                  {schedules?.map((schedule, index) => (
                    <Avatar
                      key={schedule.id}
                      id={schedule.id}
                      type={actionParam != "view" ? "edit" : "view"}
                      name={`Minha agenda`}
                      imageUrl="/calendar.png"
                      onClick={handleActionSchedule}
                    />
                  ))}

                  {!schedules.length && actionParam !== "add" ? (
                    <Avatar
                      id="0"
                      type="add"
                      name={"Criar agenda"}
                      imageUrl="/paw.svg"
                      isNew
                      onClick={handleActionSchedule}
                    />
                  ) : schedules.length ? null : (
                    <Banner type="warning" open={true}>
                      Esta opção fica disponível após o cadastro do cliente.
                    </Banner>
                  )}
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

export default UserForm;
