"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CategoryDTO, CustomerDTO, PetDTO } from "@/src/dtos";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import SchedulingHeader from "../scheduling-header";
import SchedulingProgress from "../scheduling-progress";
import { UrlsEnum } from "@/src/enums";
import { useProfile } from "@/src/hooks/useProfile";
import { useCompany } from "@/src/hooks/useCompany";
import SearchModal from "@components/modal/search-modal";

import { Banner } from "@/src/components";
import RadioCard from "../components/radio-card";
import IconButton from "@/src/components/button-ps";
import { useAppointment } from "@/src/hooks/useAppointment";
import { SkeletonCard } from "@/src/components/skeleton";
import { useApp } from "@/src/hooks/useApp";

export default function Scheduling02() {
  const [filteredArray, setFilteredArray] = useState<CustomerDTO[]>([]);
  const [selectedPetCustomer, setSelectedPetCustomer] = useState<PetDTO[]>([]);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [customers, setCustomers] = useState<CustomerDTO[]>(
    [] as CustomerDTO[]
  );

  const route = useRouter();
  const { isLoading, setIsLoading } = useApp();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();
  const { schedulingFormData, setAppointmentCustomer, setAppointmentPet } =
    useAppointment();

  const selectedCompany = findSelectedCompanyById(profile?.companyId);

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await api.get(
          `/sys${UrlsEnum.CUSTOMERS}?companyId=${selectedCompany?.id}`
        );
        setCustomers(response.data.content);
        setFilteredArray(response.data.content);
      } catch (error: any) {
        const isAppError = error instanceof AppError;
        const title = isAppError
          ? error.message
          : "Não foi possível carregar os Dados";
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, [selectedCompany?.id]);

  async function getDataPet(customerId: string) {
    try {
      setIsLoading(true);
      const petResponse = await api.get(
        `${UrlsEnum.PETS}?customerId=${customerId}`
      );
      setSelectedPetCustomer(petResponse.data);
    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os Dados";
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log("passou", schedulingFormData.customer?.id);
    if (schedulingFormData.customer?.id) {
      getDataPet(schedulingFormData.customer.id);
    }
  }, [schedulingFormData]);

  const handleSearch = (searchValue: string) => {
    const lowerCaseSearch = searchValue.toLowerCase();

    const filtered =
      searchValue?.length > 2
        ? customers.filter((item) =>
            item.name.toLowerCase().includes(lowerCaseSearch)
          )
        : customers;

    setFilteredArray(filtered);
  };

  const handleItemClick = (item: CustomerDTO) => {
    if (item?.id) {
      setAppointmentCustomer(item);
      getDataPet(item.id);
    }
  };

  const handlePetSelect = (pet: PetDTO) => {
    setAppointmentPet(pet);
  };

  function handleAction() {
    route.push(`/scheduling-03`);
  }

  function handleBack() {
    route.replace(`/scheduling-01`);
  }

  function handleNewPet() {
    route.push(
      `/pet/0?action=add&customerId=${schedulingFormData?.customer?.id}`
    );
  }

  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="relative flex">
        {/* Content */}
        <div className="w-full">
          <div className="h-full flex flex-col after:flex-1">
            <div className="flex-1">
              <SchedulingHeader />
              <SchedulingProgress step={2} />
            </div>

            <div className="px-4 py-4">
              <div className="max-w-md mx-auto">
                <h1 className="text-2xl text-slate-600 dark:text-slate-100 font-bold mb-6">
                  Selecione o cliente
                </h1>
                <button
                  id="form-search"
                  className="form-input w-full flex justify-center "
                  aria-controls="quick-find-modal"
                  onClick={(e) => {
                    setSearchModalOpen(true);
                  }}
                >
                  <svg
                    className="w-4 h-4 shrink-0 fill-primary-500 text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400 ml-3 mr-2"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                    <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                  </svg>
                  <span className="text-primary-500">Pesquisar cliente</span>
                </button>
                {/* Form */}
                <form>
                  {/* Quick Find */}
                  <div className="m-1.5">
                    {/* Start */}
                    <SearchModal<CustomerDTO>
                      isOpen={searchModalOpen}
                      setIsOpen={setSearchModalOpen}
                      data={filteredArray}
                      onSearch={handleSearch}
                      onItemClick={handleItemClick}
                    />{" "}
                  </div>
                  {/* End */}
                  {schedulingFormData?.customer ? (
                    <div className="space-y-3 mb-8">
                      <label className="relative block cursor-pointer">
                        <input
                          type="radio"
                          name="radio-buttons"
                          className="peer sr-only"
                          defaultChecked
                        />
                        <div className="flex items-center bg-white text-sm font-medium text-slate-800 dark:text-slate-100 p-4 rounded dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm duration-150 ease-in-out">
                          <svg
                            className="inline-flex w-8 h-8 shrink-0 fill-current mr-2"
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
                          <span>{schedulingFormData?.customer.name}</span>
                        </div>
                        <div
                          className="absolute inset-0 border-2 border-transparent peer-checked:border-primary-400 dark:peer-checked:border-primary-500 rounded pointer-events-none"
                          aria-hidden="true"
                        ></div>
                      </label>
                    </div>
                  ) : (
                    <Banner type="warning" open={true}>
                      Por favor, selecione um cliente para prosseguir.
                    </Banner>
                  )}
                </form>
                {/* área do pet */}
                {selectedPetCustomer.length ? (
                  <>
                    <h1 className="text-2xl text-slate-600 dark:text-slate-100 font-bold mb-6">
                      Selecione o pet
                    </h1>
                    <div className="sm:flex space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
                      {selectedPetCustomer.map((pet) => (
                        <RadioCard
                          key={pet.id}
                          onClick={() => handlePetSelect(pet)}
                          label={pet.name}
                          description={pet.breed}
                          defaultChecked={pet.id === schedulingFormData.pet?.id}
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
                  </>
                ) : schedulingFormData?.customer ? (
                  <>
                    <Banner type="warning" open={true}>
                      Ops! Parece que este cliente ainda não possui nenhum pet
                      cadastrado
                    </Banner>
                  </>
                ) : null}
                {schedulingFormData?.customer && (
                  <button
                    onClick={handleNewPet}
                    className="btn block w-full dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-primary-500"
                  >
                    Cadastrar PET
                  </button>
                )}
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
                    type="button"
                    onButtonClick={handleAction}
                    buttonLabel="Avançar"
                    disabled={
                      !(
                        !!schedulingFormData.customer?.id &&
                        !!schedulingFormData.pet?.id
                      )
                    }
                    icon={
                      <path d="M14.3 2.3L5 11.6 1.7 8.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4 4c.2.2.4.3.7.3.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z" />
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <OnboardingImage /> */}
      </div>
    </main>
  );
}
