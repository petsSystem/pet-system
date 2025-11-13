"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

import { AppError } from "@utils/AppError";
import { useProfile } from "@hooks/useProfile";

import Select, { Option } from "@/src/components/select-ps";
import { api } from "@services/api";

import { zodResolver } from "@hookform/resolvers/zod";

import { getActionLabel, ActionType } from "@utils/getActionLabel";
import { useCompany } from "@/src/hooks/useCompany";
import { Input } from "@/src/components";
import { useForm, SubmitHandler } from "react-hook-form";
import { toastPS } from "@/src/components/Toast";
import { ActionsEnum, ResourcesEnum, UrlsEnum } from "@/src/enums";
import Switch from "@/src/components/ps-switch";
import IconButton from "@/src/components/button-ps";
import { ProfileRoleResponseDTO } from "@/src/dtos";

import { extractNumbers } from "@utils/chars";
import { formatWithMask } from "@utils/mask";
import { CompanyDTO } from "@/src/dtos/CompanyDTO";
import { useApp } from "@/src/hooks/useApp";
import { checkPermission } from "@/src/utils/checkPermission";

type Params = {
  id: string;
};

interface FormInputs {
  name: string;
  cnpj: string;
  phone: string;
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
  active: boolean;
}

const CompanyForm = () => {
  const params: Params = useParams();
  const searchParams = useSearchParams();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();
  const { isLoading, setIsLoading } = useApp();

  const { id: idParam } = params;
  const actionParam: string | null = searchParams.get("action");
  const labelButton = getActionLabel("edit");
  const selectedCompany = findSelectedCompanyById(profile?.companyId);

  const [customerData, setCustomerData] = useState<CompanyDTO | null>(null);

  const permission = checkPermission({
    resource: ResourcesEnum.CUSTOMER,
    action: ActionsEnum.EDIT,
    permissions: profile?.permissions,
  });
  const isView = actionParam === "view" || !permission;

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    // resolver: zodResolver(validationSchema),
    // defaultValues: {
    //   origin: "SYS",
    //   active: true,
    //   appStatus: "PENDING",
    // },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await api.get<any>(
          `${UrlsEnum.COMPANIES}/${selectedCompany?.id}`
        );
        setCustomerData(response.data);
      } catch (error: any) {
        console.error("Erro ao buscar dados os dados da Empresa:", error);
        const isAppError = error instanceof AppError;
      } finally {
        setIsLoading(false);
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
        `${UrlsEnum.CUSTOMERS}/${selectedCompany?.id}`,
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

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    const addUserData = {
      name: data.name,
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
      await api.put(
        `${UrlsEnum.COMPANIES}/${selectedCompany?.id}`,
        addUserData
      );
      toastPS("Inforações atualizadas com sucesso", "success");
    } catch (errors: any) {
      console.log("error", errors);
      toastPS(errors.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

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
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  <Input
                    label="Nome:"
                    id="name"
                    defaultValue={customerData?.name ?? ""}
                    register={register}
                    placeholder="Digite o nome da empresa"
                    errors={errors.name?.message}
                    disabled={isView}
                  />
                  <Input
                    label="CNPJ:"
                    id="cnpj"
                    defaultValue={customerData?.cnpj ?? ""}
                    placeholder="Digite o cnpj"
                    register={register}
                    errors={errors.cnpj?.message}
                    disabled
                    mask={"99.999.999/9999-99"}
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
                    label="País:"
                    register={register}
                    value="Brasil"
                    options={[{ label: "Brasil", value: "Brasil" }]}
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
    </div>
  );
};

export default CompanyForm;
