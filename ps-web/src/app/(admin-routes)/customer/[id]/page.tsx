"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

import Image, { StaticImageData } from "next/image";

import { AppError } from "@utils/AppError";
import { useProfile } from "@hooks/useProfile";
import { useApp } from "@hooks/useApp";

import { validationSchema } from "./validationSchema";
import { api } from "@services/api";

import { zodResolver } from "@hookform/resolvers/zod";

import { getActionLabel, ActionType } from "./utils/getActionLabel";
import { useCompany } from "@/src/hooks/useCompany";
import { useForm, SubmitHandler } from "react-hook-form";
import { toastPS } from "@/src/components/Toast";
import { UrlsEnum } from "@/src/enums";
import { Avatar, Banner, Input } from "@/src/components";
import IconButton from "@/src/components/button-ps";
import { ProfileRoleResponseDTO } from "@/src/dtos";
import Select, { Option } from "@/src/components/select-ps";

import { extractNumbers } from "@utils/chars";
import { formatWithMask } from "@utils/mask";
import { CustomerDTO, PetDTO } from "@/src/dtos";

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

const CustomerForm = () => {
  const params: Params = useParams();
  const searchParams = useSearchParams();
  const { profile } = useProfile();
  const { setIsLoading } = useApp();
  const { findSelectedCompanyById } = useCompany();
  const route = useRouter();

  const { id: idParam } = params;
  const actionParam: string | null = searchParams.get("action");
  const labelButton = getActionLabel(actionParam as ActionType);
  const selectedCompany = findSelectedCompanyById(profile?.companyId);

  const [profiles, setProfiles] = useState<ProfileRoleResponseDTO[]>([]);
  const [customerData, setCustomerData] = useState<CustomerDTO | null>(null);
  const [petsData, setPetsData] = useState<PetDTO[] | null>([]);

  const isView = actionParam === "view";

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      origin: "SYS",
      active: true,
      appStatus: "PENDING",
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await api.get<any>(
          `/sys${UrlsEnum.CUSTOMERS}/${idParam}`
        );
        const formatCustomer = formatCustomerData(response.data);
        setCustomerData(formatCustomer);
      } catch (error: any) {
        console.error("Erro ao buscar dados do cliente:", error);
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
    async function fetchData() {
      try {
        const response = await api.get<any>(
          `${UrlsEnum.PETS}?customerId=${idParam}`
        );
        setPetsData(response.data);
      } catch (error: any) {
        console.error("Erro ao buscar dados do cliente:", error);
        const isAppError = error instanceof AppError;
      }
    }

    if (idParam !== "0") {
      fetchData();
    }
  }, [idParam]);

  const handleStateCustomerChange = async (isActive: boolean) => {
    try {
      setIsLoading(true);
      const response = await api.patch<any>(
        `/sys${UrlsEnum.CUSTOMERS}/${idParam}`,
        [
          {
            op: "replace",
            path: "/active",
            value: isActive,
          },
        ]
      );
      setCustomerData(response.data);
    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error?.message
        : "Não foi possível entrar. Tente novamente mais tarde";
    } finally {
      setIsLoading(false);
    }
  };

  const formatCustomerData = (data: CustomerDTO) => {
    return {
      id: data.id,
      name: data.name,
      cpf: formatWithMask(data?.cpf, "999.999.999-00"),
      username: data.username,
      changePassword: data.changePassword,
      role: data.role,
      email: data.email,
      phone: formatWithMask(data.phone, "(99)99999-9999"),
      birthDate: data.birthDate,
      origin: data.origin,
      appStatus: data.appStatus,
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

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    if (actionParam === "add") {
      const addUserData = {
        ...data,
        cpf: extractNumbers(data.cpf),
        phone: extractNumbers(data.phone),
        companyId: selectedCompany?.id,
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
        await api.post(`/sys${UrlsEnum.CUSTOMERS}`, addUserData);
        toastPS("Cliente adicionado com sucesso", "success");
        route.push(`/customer`);
      } catch (errors: any) {
        console.log("error", errors);
        toastPS(errors.message, "error");
      } finally {
        setIsLoading(false);
      }
    } else if (actionParam === "edit") {
      const alterUserData = {
        name: data.name,
        email: data.email,
        birthDate: data.birthDate,
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
        await api.put(`/sys${UrlsEnum.CUSTOMERS}/${idParam}`, alterUserData);
        toastPS("Usuário alterado com sucesso", "success");
        route.push(`/customer`);
      } catch (error: any) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  function handleActionPet(petId: string, action: string) {
    route.push(`/pet/${petId}?action=${action}&customerId=${customerData?.id}`);
  }

  return (
    <div className="relative bg-white-100 h-full">
      {(customerData || actionParam === "add") && (
        <div className="px-4 sm:px-6 lg:px-4 py-2 w-full max-w-[96rem] mx-auto">
          <div className="space-y-8 ">
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl text-slate-500 font-bold mb-4">
                    Dados Gerais
                  </h2>
                  {/* <Switch
                    id="active"
                    initialChecked={
                      !!customerData?.active || actionParam === "add"
                    }
                    labels={{ on: "Cliente Ativo", off: "Cliente Inativo" }}
                    onChange={handleStateCustomerChange}
                    disabled={isView || actionParam === "add"}
                  /> */}
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  <Input
                    label="Nome:"
                    id="name"
                    defaultValue={customerData?.name ?? ""}
                    register={register}
                    placeholder="Digite seu nome"
                    errors={errors.name?.message}
                    disabled={isView}
                  />
                  <Input
                    label="CPF:"
                    id="cpf"
                    defaultValue={customerData?.cpf ?? ""}
                    placeholder="Digite seu cpf"
                    register={register}
                    errors={errors.cpf?.message}
                    disabled={isView || actionParam === "edit"}
                    mask={"999.999.999-99"}
                  />
                  <Input
                    label="E-mail:"
                    id="email"
                    defaultValue={customerData?.email ?? ""}
                    placeholder="Digite seu email"
                    register={register}
                    errors={errors.email?.message}
                    disabled={isView}
                  />
                  <Input
                    label="Telefone:"
                    id="phone"
                    defaultValue={customerData?.phone ?? ""}
                    placeholder="Digite o telefone"
                    register={register}
                    errors={errors.phone?.message}
                    disabled={isView}
                    mask={"(99)99999-9999"}
                  />
                  <Input
                    label="Aniversário:"
                    id="birthDate"
                    defaultValue={customerData?.birthDate ?? ""}
                    placeholder="dd/mm/aaaa"
                    register={register}
                    errors={errors.birthDate?.message}
                    disabled={isView}
                    mask="99/99/9999"
                  />
                </div>
                <h2 className="text-2xl text-slate-500 font-bold mb-4">
                  Endereço
                </h2>
                <div className="grid gap-2 md:grid-cols-3">
                  <Input
                    label="CEP:"
                    id="address.postalCode"
                    defaultValue={customerData?.address?.postalCode ?? ""}
                    placeholder="Digite seu CEP"
                    register={register}
                    errors={errors.address?.postalCode?.message}
                    disabled={isView}
                    mask={"99999-999"}
                  />
                  <Input
                    label="Rua:"
                    id="address.street"
                    defaultValue={customerData?.address?.street ?? ""}
                    placeholder="Nome da rua"
                    register={register}
                    errors={errors.address?.street?.message}
                    disabled={isView}
                  />
                  <Input
                    label="Número:"
                    id="address.number"
                    defaultValue={customerData?.address?.number ?? ""}
                    placeholder="Digite o número"
                    register={register}
                    errors={errors.address?.number?.message}
                    disabled={isView}
                    mask={"99999"}
                  />
                  <Input
                    label="Bairro:"
                    id="address.neighborhood"
                    defaultValue={customerData?.address?.neighborhood ?? ""}
                    placeholder="Digite o bairro"
                    register={register}
                    errors={errors.address?.neighborhood?.message}
                    disabled={isView}
                  />
                  <Input
                    label="Cidade:"
                    id="address.city"
                    defaultValue={customerData?.address?.city ?? ""}
                    placeholder="Digite sua cidade"
                    register={register}
                    errors={errors.address?.city?.message}
                    disabled={isView}
                  />
                  <Input
                    label="Estado:"
                    id="address.state"
                    defaultValue={customerData?.address?.state ?? ""}
                    placeholder="Digite seu estado"
                    register={register}
                    errors={errors.address?.state?.message}
                    disabled={isView}
                  />
                  <Select
                    id="address.country"
                    label="País"
                    register={register}
                    options={[{ label: "Brasil", value: "Brasil" }]}
                    value="Brasil"
                    errors={errors.address?.country?.message}
                    disabled={isView}
                  />
                </div>

                <h2 className="text-2xl text-slate-500 font-bold mb-4">Pets</h2>
                <div className="flex gap-6  ">
                  {petsData?.map((pet) => (
                    <Avatar
                      key={pet.id}
                      id={pet.id}
                      type={actionParam != "view" ? "edit" : "view"}
                      name={pet.name}
                      imageUrl="/logo.png"
                      onClick={handleActionPet}
                    />
                  ))}

                  {actionParam !== "add" ? (
                    <Avatar
                      id="0"
                      type="add"
                      name={"Novo pet"}
                      imageUrl="/paw.svg"
                      isNew
                      onClick={handleActionPet}
                    />
                  ) : (
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

export default CustomerForm;
