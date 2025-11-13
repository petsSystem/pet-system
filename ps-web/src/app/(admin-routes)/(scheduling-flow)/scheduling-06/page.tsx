"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserDTO } from "@/src/dtos";
import { useProfile } from "@/src/hooks/useProfile";
import { useCompany } from "@/src/hooks/useCompany";
import { useAppointment } from "@/src/hooks/useAppointment";
import SchedulingProgress from "../scheduling-progress";
import { useApp } from "@/src/hooks/useApp";
import IconButton from "@/src/components/button-ps";
import ResumeInfoItem from "../components/resume-item";
import {
  fetchMonthAppointments,
  AvailableHours,
  AppointmentCreateRequest,
  createAppointment,
} from "@/src/services/appointments-service";

import { formatDate } from "@/src/utils/date-utils";
import {
  IconAdditional,
  IconCalendarSchedule,
  IconCustomer,
  IconCut,
  IconDog,
  IconHour,
  IconProfessional,
} from "@/src/components/icons";
import { UrlsEnum } from "@/src/enums";
import { api } from "@/src/services/api";
import { AppError } from "@/src/utils/AppError";
import { formatNumberToCurrency } from "@/src/utils/formatNumberToCurrency";

interface StatusDayResponse {
  [data: string]: boolean;
}

interface ArrayHour {
  label: string;
  disabled: boolean;
}

export default function Scheduling01() {
  const { buildCreateAppointment, clearAppointment, schedulingFormData } =
    useAppointment();
  const { isLoading, setIsLoading } = useApp();
  const [monthDate, setMonthDate] = useState<StatusDayResponse>();
  const route = useRouter();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();
  const selectedCompany = findSelectedCompanyById(profile?.companyId);

  async function createAppointmentReq(
    appointmentCreate: AppointmentCreateRequest
  ) {
    try {
      setIsLoading(true);
      await createAppointment(appointmentCreate);
      clearAppointment();
      route.push(`/scheduling-07`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateAppointment = () => {
    const appointmentRequest = buildCreateAppointment({
      companyId: selectedCompany!.id,
    });
    createAppointmentReq(appointmentRequest);
  };

  function handleAction() {
    route.push(`/scheduling-07`);
  }

  function handleBack() {
    route.replace(`/scheduling-05`);
  }

  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="relative flex">
        <div className="w-full">
          <div className="h-full flex flex-col after:flex-1">
            <div className="flex-1">
              <SchedulingProgress step={6} />
            </div>
            <div className="px-4 sm:px-6 lg:px-8 py-4 w-full max-w-[96rem] mx-auto">
              {/* resume Information */}
              <div className="max-w-lg mx-auto ">
                <section>
                  <h3 className="text-2xl text-slate-600 dark:text-slate-100 font-bold mb-1">
                    Revise o agendamento
                  </h3>
                  <div className="text-sm mb-8">
                    Por favor, revise e realize a análise das informações do
                    agendamento.
                  </div>

                  <ul>
                    <h4 className="text-lg leading-snug text-slate-500 font-bold mb-1 mt-4">
                      Cliente
                    </h4>

                    <ResumeInfoItem
                      label={schedulingFormData.customer?.name}
                      value=""
                      editLink="/scheduling-02"
                      helperText={schedulingFormData.customer?.email}
                      icon={IconCustomer}
                    />
                    <ResumeInfoItem
                      label={schedulingFormData.pet?.name}
                      value=""
                      editLink="/scheduling-02"
                      helperText={schedulingFormData.pet?.breed}
                      icon={IconDog}
                    />
                    <h4 className="text-lg leading-snug text-slate-500 font-bold mb-1 mt-4">
                      Detalhes do agendamento
                    </h4>
                    <ResumeInfoItem
                      label={schedulingFormData.product?.name}
                      value={`R$ ${formatNumberToCurrency(
                        schedulingFormData.product?.amount
                      )}`}
                      editLink="/scheduling-03"
                      helperText="Serviço"
                      icon={IconCut}
                    />
                    {schedulingFormData?.additionalIds?.map((additionalId) => {
                      const additional =
                        schedulingFormData.product?.additionals.find(
                          (add) => add.id === additionalId
                        );

                      return (
                        <ResumeInfoItem
                          key={additionalId}
                          label={additional?.name}
                          value={`R$ ${formatNumberToCurrency(
                            additional?.amount
                          )}`}
                          editLink="/scheduling-03"
                          helperText="Adicional"
                          icon={IconAdditional}
                        />
                      );
                    })}

                    <ResumeInfoItem
                      label={schedulingFormData.user?.name}
                      value={""}
                      editLink="/scheduling-04"
                      helperText="Profissional"
                      icon={IconProfessional}
                    />
                    <ResumeInfoItem
                      label={formatDate(schedulingFormData?.selectedDay)} //schedulingFormData?.selectedDay?.toString()}
                      value=""
                      editLink="/scheduling-05"
                      helperText="Data do agendamento"
                      icon={IconCalendarSchedule}
                    />
                    <ResumeInfoItem
                      label={schedulingFormData?.selectedHour?.toString()} //schedulingFormData?.selectedDay?.toString()}
                      value=""
                      editLink="/scheduling-05"
                      helperText="Hora agendada"
                      icon={IconHour}
                    />
                  </ul>
                </section>
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
                    onButtonClick={handleCreateAppointment}
                    buttonLabel="Finalizar agendamento"
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
      </div>
    </main>
  );
}
