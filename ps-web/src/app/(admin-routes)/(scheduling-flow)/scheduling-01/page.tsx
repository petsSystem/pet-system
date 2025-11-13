"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CategoryDTO } from "@/src/dtos";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { UrlsEnum } from "@/src/enums";
import { useProfile } from "@/src/hooks/useProfile";
import { useCompany } from "@/src/hooks/useCompany";
import { useAppointment } from "@/src/hooks/useAppointment";

import Link from "next/link";
import SchedulingHeader from "../scheduling-header";
import SchedulingProgress from "../scheduling-progress";

import RadioCard from "../components/radio-card";
import IconButton from "@/src/components/button-ps";
import { SkeletonCard } from "@/src/components/skeleton";
import { useApp } from "@/src/hooks/useApp";

export default function Scheduling01() {
  const { setAppointmentCategory, schedulingFormData } = useAppointment();
  const { isLoading, setIsLoading } = useApp();
  const [filteredArray, setFilteredArray] = useState<CategoryDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>(
    [] as CategoryDTO[]
  );

  const route = useRouter();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();

  const selectedCompany = findSelectedCompanyById(profile?.companyId);

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);

        const response = await api.get(
          `${UrlsEnum.CATEGORIES}?companyId=${selectedCompany?.id}&active=true`
        );

        setCategories(response.data);
        setFilteredArray(response.data);
      } catch (error: any) {
        const isAppError = error instanceof AppError;
        const title = isAppError
          ? error.message
          : "Não foi possível carregar as Categorias";
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, [selectedCompany?.id]);

  const handleCategorySelect = (category: CategoryDTO) => {
    setAppointmentCategory(category);
  };

  function handleAction() {
    route.push(`/scheduling-02`);
  }

  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="relative flex">
        {/* Content */}
        <div className="w-full">
          <div className="h-full flex flex-col after:flex-1">
            <div className="flex-1">
              <SchedulingHeader />
              <SchedulingProgress step={1} />
            </div>

            <div className="px-4 py-8">
              <div className="max-w-lg mx-auto">
                <h3 className="text-2xl text-slate-600 dark:text-slate-100 font-bold mb-6">
                  Selecione o tipo do serviço
                </h3>

                {/* Form */}
                <form>
                  <div className="sm:flex space-y-3 sm:space-y-0 sm:space-x-4 mb-8 ">
                    {categories.map((category) => (
                      <RadioCard
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        label={category.label}
                        description={category.description}
                        defaultChecked={
                          category.id === schedulingFormData.category?.id
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
                  <div className="flex items-center justify-between space-x-6 mb-8">
                    <div>
                      <div className="text-xs">
                        {`Escolha o tipo de serviço desejado para atender às
                        necessidades do seu pet e clique no botão "Avançar".`}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <IconButton
                      type="button"
                      onButtonClick={handleAction}
                      buttonLabel="Avançar"
                      disabled={!schedulingFormData.category}
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
