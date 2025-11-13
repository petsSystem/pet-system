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
import { Avatar, Banner } from "@/src/components";
import IconButton from "@/src/components/button-ps";
import ModalBasic from "@components/modal-basic";

import { extractNumbers } from "@utils/chars";
import { formatWithMask } from "@utils/mask";
import { CategoryDTO, ProductDTO } from "@/src/dtos";
import Select, { Option } from "@/src/components/select-ps";
import Switch from "@/src/components/ps-switch";
import CheckBox from "@components/checkbox-ps";
import { convertCurrencyToNumber } from "@/src/utils/currency";

import { formatNumberToCurrency } from "@/src/utils/formatNumberToCurrency";

type Params = {
  id: string;
};

type CategoryOption = {
  value: string | boolean;
  label: string;
};

interface FormInputs {
  categoryId: string;
  name: string;
  amount: number | string;
  additional: boolean | string;
  additionalIds: string[];
  duration: string;
  intervalMinutes: number;
}

const ServiceForm = () => {
  const [showAdditionalServices, setShowAdditionalServices] =
    useState<boolean>(false);
  const [productData, setProductData] = useState<ProductDTO | null>(null);
  const [additionalProductData, setAdditionalProductData] = useState<
    ProductDTO[] | null
  >([]);
  const [categories, setCategories] = useState<CategoryOption[]>(
    [] as CategoryOption[]
  );
  const [productsMsg, setProductsMsg] = useState<string>(
    '"Nenhum perfil cadastrado"'
  );

  const params: Params = useParams();
  const searchParams = useSearchParams();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();
  const selectedCompany = findSelectedCompanyById(profile?.companyId);

  const route = useRouter();

  const { id: idParam } = params;
  const actionParam: string | null = searchParams.get("action");
  const customerIdParam: string | null = searchParams.get("customerId");
  const labelButton = getActionLabel(actionParam as ActionType);

  const { setIsLoading } = useApp();

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
        const response = await api.get<ProductDTO>(
          `${UrlsEnum.PRODUCTS}/${params.id}`
        );
        const product: ProductDTO = response.data;
        setProductData(product);
        setShowAdditionalServices(!product.additional);
      } catch (error: any) {
        console.error("Erro ao buscar dados", error);
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
        const response = await api.get<CategoryDTO[]>(
          `${UrlsEnum.CATEGORIES}?companyId=${selectedCompany?.id}&active=true`
        );

        const responseCategories = response.data;
        const convertedData = responseCategories
          .filter((cat) => cat.active)
          .map((item: CategoryDTO) => ({
            label: item.label,
            value: item.id,
          }));

        setCategories(convertedData);
      } catch (error: any) {
        console.error("Erro ao buscar dados do cliente:", error);
        const isAppError = error instanceof AppError;
      }
    }

    fetchDataDogs();
  }, [idParam]);

  async function getData() {
    try {
      setIsLoading(true);

      const response = await api.get(
        `${UrlsEnum.PRODUCTS}?companyId=${
          selectedCompany?.id
        }&additional=${true}`
      );
      setAdditionalProductData(response?.data?.content ?? []);
    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os Dados";

      setProductsMsg(title);
      toastPS(title, "error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleStateProductChange = async (isActive: boolean) => {
    try {
      setIsLoading(true);
      const response = await api.patch<any>(
        `${UrlsEnum.PRODUCTS}/${params.id}`,
        [
          {
            op: "replace",
            path: "/active",
            value: isActive,
          },
        ]
      );
      setProductData(response.data);
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
      const addProductData = {
        ...data,
        companyId: selectedCompany?.id,
        amount: convertCurrencyToNumber(data.amount.toString()),
        additional: JSON.parse(data.additional as string),
        additionalIds: [],
        intervalMinutes: Number(data.intervalMinutes),
      };
      console.log(addProductData);
      try {
        setIsLoading(true);
        await api.post(`${UrlsEnum.PRODUCTS}`, addProductData);
        toastPS("Adicionado com sucesso", "success");
        route.back();
      } catch (errors: any) {
        console.log("error", errors);
        toastPS(errors.message, "error");
      } finally {
        setIsLoading(false);
      }
    } else if (actionParam === "edit") {
      const alterProductData = {
        ...data,
        companyId: selectedCompany?.id,
        amount: convertCurrencyToNumber(data.amount.toString()),
        additional: JSON.parse(data.additional as string),
      };
      try {
        setIsLoading(true);
        await api.put(`${UrlsEnum.PRODUCTS}/${idParam}`, alterProductData);
        toastPS("Pet alterado com sucesso", "success");
        route.back();
      } catch (error: any) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  function handleBack() {
    route.back();
  }

  const optionsAdditionItem: Option[] = [
    { label: "Principal", value: false },
    { label: "Adicional", value: true },
  ];

  useEffect(() => {
    if (productData) {
      reset({
        additionalIds: productData.additionalIds,
        categoryId: productData.categoryId,
        additional: productData.additional,
      });
    }
  }, [productData, reset]);

  return (
    <div className="relative bg-white-100 h-full">
      {(productData || actionParam === "add") && (
        <div className="px-4 sm:px-6 lg:px-4 py-2 w-full max-w-[96rem] mx-auto">
          <div className="space-y-8 ">
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl text-slate-500 font-bold mb-4">
                    Dados Gerais do Serviço
                  </h2>
                  {actionParam === "edit" && !productData?.active && (
                    <Banner type="warning" open={true}>
                      O serviço deve estar ativo para alterações.
                    </Banner>
                  )}
                  <Switch
                    id="exemplo"
                    initialChecked={!!productData?.active}
                    labels={{ on: "Serviço Ativo", off: "Serviço Inativo" }}
                    onChange={handleStateProductChange}
                    disabled={isView || actionParam === "add"}
                  />
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  <Select
                    id="categoryId"
                    label="Categoria"
                    register={register}
                    options={categories}
                    errors={errors.categoryId?.message}
                    disabled={isView}
                  />
                  <Input
                    label="Nome:"
                    id="name"
                    defaultValue={productData?.name ?? ""}
                    register={register}
                    placeholder="Digite o nome do serviço"
                    errors={errors.name?.message}
                    disabled={isView}
                  />
                  <CurrencyInput
                    id="amount"
                    key="amount"
                    name="amount"
                    register={register}
                    label="Valor"
                    mask="currency"
                    prefix="R$"
                    placeholder="9,99"
                    disabled={isView}
                    defaultValue={
                      formatNumberToCurrency(productData?.amount) ?? 0
                    }
                  />
                  <Input
                    label="Duração (em minutos):"
                    type="number"
                    id="intervalMinutes"
                    defaultValue={productData?.intervalMinutes ?? ""}
                    register={register}
                    placeholder="20"
                    errors={errors.intervalMinutes?.message}
                    disabled={isView}
                    tooltipMessage="Tempo médio do serviço em minutos"
                  />
                  <Select
                    id="additional"
                    label="Tipo"
                    register={register}
                    options={optionsAdditionItem}
                    errors={errors.additional?.message}
                    disabled={isView}
                    // onChange={(e) => {
                    //   const selectedValue = e.target.value;
                    //   const isAdditionalFalse = selectedValue === "false";
                    //   setShowAdditionalServices(isAdditionalFalse);
                    // }}
                  />
                </div>
                {/* showAdditionalServices && */}
                {!!additionalProductData?.length && (
                  <>
                    <h2 className="text-2xl text-slate-500 font-bold mb-4">
                      Serviços Adicionais
                    </h2>

                    <div className="grid gap-2 md:grid-cols-3">
                      {!!additionalProductData?.length ? (
                        additionalProductData?.map((additionalProd, id) => (
                          <CheckBox
                            id="additionalIds"
                            key={additionalProd.id}
                            label={additionalProd.name}
                            register={register}
                            value={additionalProd.id}
                            disabled={isView}
                          />
                        ))
                      ) : (
                        <Banner type="warning" open={true}>
                          {productsMsg}
                        </Banner>
                      )}
                    </div>
                  </>
                )}

                <div className="flex justify-between mb-20 mt-6">
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

export default ServiceForm;
