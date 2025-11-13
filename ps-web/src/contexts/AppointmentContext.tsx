"use client";
import { createContext, ReactNode, useState } from "react";
import {
  CategoryDTO,
  CustomerDTO,
  PetDTO,
  ProductDTO,
  UserDTO,
  ScheduleDTO,
} from "@dtos/index";
import { AppointmentCreateRequest } from "../services/appointments-service";
import { formatDate } from "../utils/date-utils";

type FormData = {
  category: CategoryDTO | null;
  customer: CustomerDTO | null;
  pet: PetDTO | null;
  product: ProductDTO | null;
  user: UserDTO | null;
  selectedDay: Date | null;
  selectedHour: string | null;
  schedule: ScheduleDTO | null;
  additionalIds?: string[] | null;
};

const initialFormData: FormData = {
  category: null,
  customer: null,
  pet: null,
  product: null,
  user: null,
  selectedDay: null,
  selectedHour: null,
  schedule: null,
  additionalIds: null,
};

type FormContextType = {
  schedulingFormData: FormData;
  setAppointmentCategory: (category: CategoryDTO) => void;
  setAppointmentCustomer: (customer: CustomerDTO) => void;
  setAppointmentPet: (pet: PetDTO) => void;
  setAppointmentProduct: (product: ProductDTO) => void;
  setAppointmentUser: (user: UserDTO) => void;
  setAppointmentSelectedDay: (day: Date) => void;
  setAppointmentSelectedHour: (hour: string) => void;
  setAppointmentAdditionalIds: (additionalIds: string[]) => void;
  setAppointmentSchedule: (scheduleId: ScheduleDTO) => void;
  clearAppointment: () => void;
  buildCreateAppointment: ({
    companyId,
  }: AppointmentCreateProps) => AppointmentCreateRequest;
};

type AppointmentProviderProps = {
  children: ReactNode;
};

type AppointmentCreateProps = {
  companyId: string;
};

export const AppointmentContext = createContext<FormContextType>(
  {} as FormContextType
);

export function AppointmentProvider({ children }: AppointmentProviderProps) {
  const [schedulingFormData, setSchedulingFormData] =
    useState<FormData>(initialFormData);

  const setAppointmentCategory = (category: CategoryDTO) => {
    setSchedulingFormData((prevState) => ({
      ...prevState,
      category,
    }));
  };

  const setAppointmentCustomer = (customer: CustomerDTO) => {
    setSchedulingFormData((prevState) => ({
      ...prevState,
      customer,
    }));
  };

  const setAppointmentPet = (pet: PetDTO) => {
    setSchedulingFormData((prevState) => ({
      ...prevState,
      pet,
    }));
  };

  const setAppointmentProduct = (product: ProductDTO) => {
    setSchedulingFormData((prevState) => ({
      ...prevState,
      product,
    }));
  };

  const setAppointmentUser = (user: UserDTO) => {
    setSchedulingFormData((prevState) => ({
      ...prevState,
      user,
    }));
  };

  const setAppointmentSelectedDay = (selectedDay: Date) => {
    setSchedulingFormData((prevState) => ({
      ...prevState,
      selectedDay,
    }));
  };

  const setAppointmentSelectedHour = (selectedHour: string) => {
    setSchedulingFormData((prevState) => ({
      ...prevState,
      selectedHour,
    }));
  };

  const setAppointmentSchedule = (schedule: ScheduleDTO) => {
    setSchedulingFormData((prevState) => ({
      ...prevState,
      schedule,
    }));
  };

  const setAppointmentAdditionalIds = (additionalIds: string[]) => {
    setSchedulingFormData((prevState) => ({
      ...prevState,
      additionalIds,
    }));
  };

  const clearAppointment = () => {
    setSchedulingFormData(initialFormData);
  };

  const buildCreateAppointment = ({
    companyId,
  }: AppointmentCreateProps): AppointmentCreateRequest => {
    return {
      companyId,
      categoryId: schedulingFormData.category?.id,
      petId: schedulingFormData.pet?.id,
      customerId: schedulingFormData.customer?.id,
      scheduleId: schedulingFormData.schedule?.id,
      userId: schedulingFormData.user?.id,
      productId: schedulingFormData.product?.id,
      additionalIds: schedulingFormData.additionalIds,
      date: formatDate(schedulingFormData.selectedDay),
      time: schedulingFormData.selectedHour,
    } as AppointmentCreateRequest;
  };

  return (
    <AppointmentContext.Provider
      value={{
        schedulingFormData,
        setAppointmentCategory,
        setAppointmentCustomer,
        setAppointmentPet,
        setAppointmentProduct,
        setAppointmentUser,
        setAppointmentSelectedDay,
        setAppointmentSelectedHour,
        setAppointmentSchedule,
        setAppointmentAdditionalIds,
        buildCreateAppointment,
        clearAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}
