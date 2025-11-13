import {
  AppointmentScheduleDTO,
  AppointmentStatus,
} from "@dtos/AppointmentDTO";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { UrlsEnum } from "@enums/index";
import { AppointmentResponse } from "../dtos/AppointmentDTO";

interface ServiceProps {
  companyId: string;
  productId?: string;
  userId?: string;
  date?: string;
}

export interface AppointmentCreateRequest {
  companyId: string;
  petId: string;
  customerId: string;
  scheduleId: string;
  userId: string;
  productId: string;
  additionalIds: string[];
  date: string;
  time: string;
}

export interface AppointmentUpdateDataStatus {
  appointmentId: string;
  status: AppointmentStatus;
  comments: string;
}

export interface StatusDayResponse {
  [data: string]: boolean;
}

export interface AvailableHours {
  [hours: string]: boolean;
}

function buildUrl(
  path: string,
  companyId: string,
  productId?: string,
  userId?: string,
  date?: string
): string {
  let url = `${path}?companyId=${companyId}`;
  if (productId !== undefined) {
    url += `&productId=${productId}`;
  }
  if (userId !== undefined) {
    url += `&userId=${userId}`;
  }
  if (date !== undefined) {
    url += `&date=${date}`;
  }
  return url;
}

export async function fetchMonthAppointments({
  companyId,
  productId,
  userId,
}: ServiceProps): Promise<StatusDayResponse> {
  try {
    const response = await api.get<StatusDayResponse>(
      buildUrl(UrlsEnum.APPOINTMENT_MONTH, companyId, productId, userId)
    );
    return response.data;
  } catch (error: any) {
    throw new AppError("Não foi possível carregar os dados");
  }
}

export async function fetchDayAppointments({
  companyId,
  productId,
  userId,
  date,
}: ServiceProps): Promise<AvailableHours> {
  try {
    const response = await api.get<AvailableHours>(
      buildUrl(UrlsEnum.APPOINTMENT_DAY, companyId, productId, userId, date)
    );
    return response.data;
  } catch (error: any) {
    throw new AppError("Não foi possível carregar os dados");
  }
}

export async function fetchAppointmentsSchedule({
  companyId,
  productId,
  userId,
  date,
}: ServiceProps): Promise<AppointmentResponse[]> {
  try {
    const response = await api.get<AppointmentResponse[]>(
      buildUrl(
        UrlsEnum.APPOINTMENT_SCHEDULE,
        companyId,
        productId,
        userId,
        date
      )
    );
    return response.data;
  } catch (error: any) {
    throw new AppError("Não foi possível carregar os dados");
  }
}

export async function createAppointment(
  appointmentCreate: AppointmentCreateRequest
): Promise<AvailableHours> {
  try {
    const response = await api.post<any>(
      UrlsEnum.APPOINTMENT,
      appointmentCreate
    );
    return response.data;
  } catch (error: any) {
    throw new AppError("Não foi possível carregar os dados");
  }
}

export async function updateAppointmentStatus(
  appointmentUpdateDataStatus: AppointmentUpdateDataStatus
): Promise<AppointmentScheduleDTO> {
  try {
    const response = await api.patch<any>(
      UrlsEnum.APPOINTMENT_STATUS,
      appointmentUpdateDataStatus
    );
    return response.data;
  } catch (error: any) {
    throw new AppError("Não foi possível carregar os dados");
  }
}
