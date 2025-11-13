"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CategoryDTO, ProductDTO } from "@/src/dtos";
import { useForm, SubmitHandler } from "react-hook-form";
import { useProfile } from "@/src/hooks/useProfile";
import { useCompany } from "@/src/hooks/useCompany";
import { useAppointment } from "@/src/hooks/useAppointment";

import Link from "next/link";
import SchedulingHeader from "../scheduling-header";
import SchedulingProgress from "../scheduling-progress";

import RadioCard from "../components/radio-card";
import IconButton from "@/src/components/button-ps";
import { fetchProducts } from "@/src/services/products-service";
import CheckBox from "@components/checkbox-ps";
import { useApp } from "@/src/hooks/useApp";
import { AdditionalProductResponse } from "@/src/dtos/ProductDTO";
import { toArray } from "@/src/utils/arrayUtil";

interface ParamGetProducts {
  categoryId: string;
  companyId: string;
  additional: boolean;
}

interface FormInputs {
  additionalId: string[];
}

export default function Scheduling01() {
  const {
    setAppointmentProduct,
    setAppointmentAdditionalIds,
    schedulingFormData,
  } = useAppointment();
  const { isLoading, setIsLoading } = useApp();
  const [products, setProducts] = useState<ProductDTO[]>([] as ProductDTO[]);

  const route = useRouter();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();

  const selectedCompany = findSelectedCompanyById(profile?.companyId);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: { additionalId: schedulingFormData.additionalIds ?? [] },
  });

  async function fetchData({
    companyId,
    categoryId,
    additional,
  }: ParamGetProducts) {
    try {
      setIsLoading(true);
      const productsData = await fetchProducts({
        companyId,
        additional,
        categoryId,
      });
      setProducts(productsData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (selectedCompany?.id && schedulingFormData.category?.id) {
      fetchData({
        companyId: selectedCompany?.id,
        categoryId: schedulingFormData.category?.id,
        additional: false,
      });
    }
  }, []);

  const handleSelect = (product: ProductDTO) => {
    setAppointmentProduct(product);
  };

  const handleSelectAdditional = (additionalIds: string[]) => {
    // console.log("pasosu aqui", additionalIds);
    setAppointmentAdditionalIds(additionalIds);
  };

  function handleAction() {
    route.push(`/scheduling-04`);
  }

  function handleBack() {
    route.replace(`/scheduling-02`);
  }

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    console.log("data", data);
    const auxData = toArray(data.additionalId);
    handleSelectAdditional(auxData);
  };

  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="relative flex">
        {/* Content */}
        <div className="w-full">
          <div className="h-full flex flex-col after:flex-1">
            <div className="flex-1">
              <SchedulingHeader />
              <SchedulingProgress step={3} />
            </div>

            <div className="px-4 py-8">
              <div className="max-w-lg mx-auto">
                <h3 className="text-2xl text-slate-600 dark:text-slate-100 font-bold mb-4">
                  Selecione o serviço 🐾
                </h3>
                {/* Form */}

                <div className="grid grid-cols-3 gap-2">
                  {products.map((product) => (
                    <RadioCard
                      key={product.id}
                      onClick={() => handleSelect(product)}
                      label={product.name}
                      description={""}
                      defaultChecked={
                        product.id === schedulingFormData.product?.id
                      }
                      icon={
                        <svg
                          className="inline-flex w-10 h-10 shrink-0 fill-current mb-2"
                          viewBox="0 0 40 40"
                        >
                          <circle
                            className="text-primary-100"
                            cx="20"
                            cy="20"
                            r="20"
                          />
                          <path
                            className="text-primary-500"
                            d="m26.371 23.749-3.742-1.5a1 1 0 0 1-.629-.926v-.878A3.982 3.982 0 0 0 24 17v-1.828A4.087 4.087 0 0 0 20 11a4.087 4.087 0 0 0-4 4.172V17a3.982 3.982 0 0 0 2 3.445v.878a1 1 0 0 1-.629.928l-3.742 1.5a1 1 0 0 0-.629.926V27a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.323a1 1 0 0 0-.629-.928Z"
                          />
                        </svg>
                      }
                    />
                  ))}
                </div>

                <h3 className="text-2md text-slate-600 dark:text-slate-100 font-bold mb-4 mt-8">
                  Escolha serviço adicionais (Opcional)
                </h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {schedulingFormData.product?.additionals.map((additional) => (
                    <CheckBox
                      id="additionalId"
                      key={additional.id}
                      label={additional.name}
                      register={register}
                      value={additional.id}
                    />
                  ))}

                  <div className="flex items-center justify-between space-x-6 my-4 ">
                    <div>
                      <div className="text-xs">
                        {`Escolha o serviço desejado para atender às
                        necessidades do seu pet e clique no botão "Avançar".`}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <IconButton
                      type="button"
                      onButtonClick={handleBack}
                      buttonLabel="Voltar"
                      variant="secondary"
                      icon={
                        <path d="M14.3 2.3L5 11.6 1.7 8.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4 4c.2.2.4.3.7.3.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z" />
                      }
                    />
                    <IconButton
                      type="submit"
                      onButtonClick={handleAction}
                      buttonLabel="Avançar"
                      disabled={!!!schedulingFormData.product?.id}
                      icon={
                        <path d="M14.3 2.3L5 11.6 1.7 8.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4 4c.2.2.4.3.7.3.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z" />
                      }
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// profiles?.map((role, id) => (
//   <CheckBox
//     id="profileIds"
//     key={id}
//     label={role.name}
//     register={register}
//     value={role.id}
//     disabled={isView}
//   />
// ))
