"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScheduleDayDTO, ScheduleDTO, UserDTO } from "@/src/dtos";
import { useProfile } from "@/src/hooks/useProfile";
import { useCompany } from "@/src/hooks/useCompany";
import { useAppointment } from "@/src/hooks/useAppointment";
import SchedulingProgress from "../scheduling-progress";
import { useApp } from "@/src/hooks/useApp";
import IconButton from "@/src/components/button-ps";
import HourRadioCard from "../components/hour-radio-card";
import {
  fetchDayAppointments,
  fetchMonthAppointments,
  AvailableHours,
} from "@/src/services/appointments-service";
import {
  CalendarProvider,
  CalendarTable,
  CalendarTitle,
  CalendarNavigation,
} from "@components/calendar";
import { convertDateToString } from "@/src/utils/date-utils";
import { api } from "@/src/services/api";
import { UrlsEnum } from "@/src/enums";

interface StatusDayResponse {
  [data: string]: boolean;
}

interface ArrayHour {
  label: string;
  disabled: boolean;
}

function getAvailableHours(availableHours: {
  [key: string]: boolean;
}): string[] {
  const horariosDisponiveis: string[] = [];

  for (const horario in availableHours) {
    if (availableHours[horario]) {
      horariosDisponiveis.push(horario);
    }
  }

  return horariosDisponiveis;
}

function convertObjectToArray(objeto: AvailableHours) {
  const arrayHour: ArrayHour[] = [];

  for (const hora in objeto) {
    const disponivel = objeto[hora];
    arrayHour.push({ label: hora, disabled: !disponivel });
  }

  return arrayHour;
}

export default function Scheduling01() {
  const {
    setAppointmentSelectedDay,
    setAppointmentSelectedHour,
    setAppointmentSchedule,
    schedulingFormData,
  } = useAppointment();
  const { isLoading, setIsLoading } = useApp();
  const [monthDate, setMonthDate] = useState<StatusDayResponse>();
  const [availableHours, setAvailableHours] = useState<ArrayHour[]>([]);
  const route = useRouter();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();
  const selectedCompany = findSelectedCompanyById(profile?.companyId);

  async function fetchData({
    companyId,
    productId,
  }: {
    companyId: string;
    productId: string;
  }) {
    try {
      setIsLoading(true);
      // const monthDate = await fetchMonthAppointments({
      //   companyId,
      //   productId,
      //   userId: schedulingFormData.user?.id,
      // });
      const [monthDate, schedules] = await Promise.all([
        fetchMonthAppointments({
          companyId,
          productId,
          userId: schedulingFormData.user?.id,
        }),
        api.get<any>(
          `${UrlsEnum.SCHEDULES}?companyId=${selectedCompany?.id}&userId=${schedulingFormData.user?.id}`
        ),
      ]);
      setAppointmentSchedule(schedules.data[0] as ScheduleDTO);
      setMonthDate(monthDate);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchDayData({
    companyId,
    productId,
    date,
  }: {
    companyId: string;
    productId: string;
    date: string;
  }) {
    try {
      setIsLoading(true);
      const availableHoursAux = await fetchDayAppointments({
        companyId,
        productId,
        userId: schedulingFormData.user?.id,
        date: date,
      });
      const availableHoursFormated = convertObjectToArray(availableHoursAux);
      setAvailableHours(availableHoursFormated);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (selectedCompany?.id && schedulingFormData.product?.id) {
      fetchData({
        companyId: selectedCompany?.id,
        productId: schedulingFormData.product?.id,
      });
    }
  }, []);

  const handleGetHoursAvailable = (date: Date) => {
    setAppointmentSelectedDay(date);
    const dateAux = convertDateToString(date);
    if (selectedCompany?.id && schedulingFormData.product?.id) {
      fetchDayData({
        companyId: selectedCompany?.id,
        productId: schedulingFormData.product?.id,
        date: dateAux,
      });
    }
  };

  function handleAction() {
    route.push(`/scheduling-06`);
  }

  function handleBack() {
    route.replace(`/scheduling-04`);
  }

  const handleHourSelect = (hour: string) => {
    setAppointmentSelectedHour(hour);
  };

  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="relative flex">
        <div className="w-full">
          <div className="h-full flex flex-col after:flex-1">
            <div className="flex-1">
              <SchedulingProgress step={5} />
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-4 w-full max-w-[96rem] mx-auto">
              <div className="pb-4">
                <CalendarProvider>
                  <div className="sm:flex sm:justify-between sm:items-center mb-4">
                    <CalendarTitle />
                    <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                      <CalendarNavigation />
                    </div>
                  </div>
                  <CalendarTable
                    size="small"
                    onDayClick={(dataObj) => handleGetHoursAvailable(dataObj)}
                    disabledDays={monthDate}
                  />
                </CalendarProvider>
              </div>
              {/* Form */}
              {!!availableHours.length && (
                <form>
                  <h3 className="text-2md text-slate-600 dark:text-slate-100 font-bold">
                    Selecione o horário para atendimento
                  </h3>
                  <div className="p-2 pb-10 h-40 grid grid-cols-4 gap-2 md:grid-cols-8 lg:md:grid-cols-12 lg:gap-4  rounded-md">
                    {availableHours.map((hour, index) => (
                      <HourRadioCard
                        key={index}
                        onClick={() => handleHourSelect(hour.label)}
                        disabled={hour.disabled}
                        label={hour.label}
                        defaultChecked={
                          false //category.id === schedulingFormData.category?.id
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
                </form>
              )}
              <div className="flex justify-between ">
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
                      !!schedulingFormData.selectedDay &&
                      !!schedulingFormData.selectedHour
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
    </main>
  );
}
