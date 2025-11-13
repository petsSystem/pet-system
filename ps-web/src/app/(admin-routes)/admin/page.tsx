"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScheduleDayDTO, ScheduleDTO, UserDTO } from "@/src/dtos";
import { useProfile } from "@/src/hooks/useProfile";
import { useCompany } from "@/src/hooks/useCompany";
import { useAppointment } from "@/src/hooks/useAppointment";
import { useApp } from "@/src/hooks/useApp";
import {
  AppointmentUpdateDataStatus,
  fetchAppointmentsSchedule,
  updateAppointmentStatus,
} from "@/src/services/appointments-service";
import { ColorDot, ModalBasic, CustomButton } from "@components/index";
import { convertDateToString, formatarDataToUse } from "@/src/utils/date-utils";
import { AppointmentResponse, AppointmentStatus } from "@dtos/AppointmentDTO";
import {
  getPaymentStatusColor,
  getStatusAppointmentColor,
  translatePaymentStatus,
  translateScheduleStatus,
} from "@/src/utils/appointment-utils";
import { EmptyState } from "@/src/components";
import Datepicker from "@components/datepicker";
import CardAppointmentItem from "@components/card-appointment-item";

import SelectStatus from "./components/select-status";
import {
  generatePetshopMessage,
  sendMessageToWhatsApp,
} from "@/src/utils/message";
import { IconWhats } from "@/src/components/icons";
import { statusList } from "@/src/utils/status-list";

interface ArrayHour {
  label: string;
  disabled: boolean;
}

export default function Home() {
  const { isLoading, setIsLoading } = useApp();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [updatedStatus, setUpdatedStatus] = useState<boolean>(false);
  const [defaultDate, setDefaultDate] = useState<Date>(new Date());
  const [selectedAppointmentData, setSelectedAppointmentData] = useState<
    AppointmentResponse[]
  >([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse>({} as AppointmentResponse);
  const route = useRouter();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();
  const selectedCompany = findSelectedCompanyById(profile?.companyId);

  async function fetchData({ companyId }: { companyId: string }) {
    const dateAux = convertDateToString(defaultDate);
    try {
      setIsLoading(true);
      const [appointments] = await Promise.all([
        fetchAppointmentsSchedule({
          companyId,
          date: dateAux,
        }),
      ]);
      setSelectedAppointmentData(appointments);
    } catch (error) {
      console.error(error);
      setSelectedAppointmentData([]);
    } finally {
      setIsLoading(false);
    }
    if (updatedStatus) {
      setUpdatedStatus(false);
    }
  }

  async function handleUpdateAppointmentStatus(
    appointmentStatusRequest: AppointmentUpdateDataStatus
  ) {
    try {
      setIsLoading(true);
      const updatedAppointmentsResponse = await updateAppointmentStatus(
        appointmentStatusRequest
      );
      updateStatusState(updatedAppointmentsResponse.status);
      setUpdatedStatus(true);
    } catch (error) {
      console.error(error);
      setSelectedAppointmentData([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (selectedCompany?.id) {
      fetchData({
        companyId: selectedCompany?.id,
      });
    }
  }, [selectedCompany?.id, defaultDate, updatedStatus]);

  const updateStatusState = (newStatus: AppointmentStatus) => {
    setSelectedAppointment((prevState) => ({
      ...prevState,
      status: newStatus,
    }));
  };

  function handleAction() {
    route.push(`/scheduling-01`);
  }

  const handleSelect = (appointment: any) => {
    setSelectedAppointment(appointment);
  };

  const handleDateChange = (selectedDates: Date[], dateStr: string) => {
    setDefaultDate(selectedDates[0]);
    setSelectedAppointment({} as AppointmentResponse);
  };

  const sendMessage = () => {
    const msg = generatePetshopMessage(selectedAppointment);
    sendMessageToWhatsApp({ message: msg, number: selectedAppointment.phone });
  };

  const handleStatusChange = (status: string) => {
    handleUpdateAppointmentStatus({
      status: status as AppointmentStatus,
      appointmentId: selectedAppointment.id,
      comments: "comments",
    });
    setModalOpen(!modalOpen);
  };

  return (
    <main className="lg:relative lg:flex bg-white dark:bg-slate-900">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        {/* Left: Title */}
        <div className="sm:flex sm:justify-between sm:items-center mb-5">
          <h3 className="text-2xl md:text-md text-slate-500 dark:text-slate-100 font-bold">
            Agendamentos 🐾
          </h3>

          {/* Right: Tittle */}
          <div className="flex">
            {selectedCompany?.id && (
              <Datepicker
                align="right"
                onChange={handleDateChange}
                defaultDate={defaultDate}
              />
            )}
            <hr className="w-px h-full bg-slate-200 dark:bg-slate-700 border-none mx-1" />

            <button
              onClick={handleAction}
              className="btn bg-primary-500 hover:bg-primary-600 text-white"
            >
              <svg
                className="w-4 h-4 fill-current opacity-50 shrink-0"
                viewBox="0 0 16 16"
              >
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
              <span className="hidden xl:block ml-2">Novo Agendamento</span>
            </button>
          </div>
        </div>

        {/* Agendamentos */}
        <div className="text-xl mb-2 font-bold text-primary-500">
          {formatarDataToUse(defaultDate)}
        </div>
        <div className="space-y-2">
          {selectedAppointmentData.length ? (
            selectedAppointmentData.map((appointment) => (
              <CardAppointmentItem
                key={appointment.id}
                cliente={appointment.customerName}
                time={appointment.time}
                pet={appointment.petName}
                nome={appointment.paymentStatus}
                valor={50}
                codeStatus={appointment.status}
                status={translateScheduleStatus(
                  appointment.status as AppointmentStatus
                )}
                onClick={() => handleSelect(appointment)}
              />
            ))
          ) : (
            <EmptyState
              title="Agendamentos não encontrados"
              description={`Nenhum agendamento foi encontrado para exibir na data ${formatarDataToUse(
                defaultDate
              )}`}
              buttonText="Criar novo agendamento"
            />
          )}
        </div>
      </div>

      <div>
        <div className="lg:sticky lg:top-16 bg-slate-50 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 lg:overflow-x-hidden lg:overflow-y-auto no-scrollbar lg:shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 lg:w-[390px] lg:h-[calc(100dvh-64px)]">
          <div className="py-8 px-4 lg:px-8">
            <div className="max-w-sm mx-auto lg:max-w-none">
              <div className="text-slate-800 dark:text-slate-100 font-semibold text-center mb-6">
                {selectedAppointment.id
                  ? "Detalhes do Agendamento"
                  : "Nenhum Agendamento Selecionado"}
              </div>

              {/* Details */}
              <div className="mt-6">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
                  Detalhes
                </div>
                <ul>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="text-sm">Cliente</div>
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">
                      {selectedAppointment.customerName}
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="text-sm">Telefone</div>
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">
                      {selectedAppointment.phone}
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="text-sm">Status</div>
                    <div className="flex items-center whitespace-nowrap">
                      <ColorDot
                        color={getStatusAppointmentColor(
                          selectedAppointment.status as AppointmentStatus
                        )}
                      />
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {translateScheduleStatus(
                          selectedAppointment.status as AppointmentStatus
                        )}
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="text-sm">Pagamento</div>
                    <div className="flex items-center whitespace-nowrap">
                      <ColorDot
                        color={getPaymentStatusColor(
                          selectedAppointment.paymentStatus
                        )}
                      />
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {translatePaymentStatus(
                          selectedAppointment.paymentStatus
                        )}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Detalhes Agendamento */}
              <div className="mt-6">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
                  Detalhes do agendamento
                </div>
                <ul>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="text-sm">Serviço</div>
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">
                      {selectedAppointment.productName}
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="text-sm">Adicional</div>
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">
                      {selectedAppointment.additionals}
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="text-sm">Profissional</div>
                    <div className="flex items-center whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">
                        {selectedAppointment.userName}
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="text-sm">Data</div>
                    <div className="flex items-center whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">
                        {selectedAppointment.date}
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="text-sm">Horário</div>
                    <div className="flex items-center whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">
                        {selectedAppointment.time}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Edit / Delete */}
              <div className="flex items-center space-x-3 mt-6">
                {selectedAppointment.id && (
                  <div className="w-1/2">
                    <button
                      onClick={sendMessage}
                      className="btn w-full dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-emerald-500"
                    >
                      {IconWhats}
                      <span className="ml-2">Mensagem</span>
                    </button>
                  </div>
                )}

                <div className="w-1/2">
                  <button
                    disabled={!selectedAppointment.id}
                    onClick={() => setModalOpen(!modalOpen)}
                    className={`btn w-full dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:hover:border-slate-600 ${
                      selectedAppointment.id
                        ? "text-primary-600 hover:border-primary-300"
                        : "text-slate-400"
                    } dark:text-slate-300`}
                  >
                    <svg
                      className={`w-4 h-4 fill-current ${
                        selectedAppointment.id
                          ? "text-primary-600"
                          : "text-slate-400"
                      } dark:text-slate-400 shrink-0`}
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
                    </svg>
                    <span className="ml-2">Alterar Status</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalBasic
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        title="Alteração de status:"
      >
        {/* Modal content */}
        <div>
          <SelectStatus
            statuses={statusList}
            onClick={handleStatusChange}
            cancelButtonText="Cancelar"
            changeStatusButtonText="Alterar Status"
            containerClassName="my-4"
            buttonClassName="my-custom-button-class"
          />
        </div>
      </ModalBasic>
    </main>
  );
}
