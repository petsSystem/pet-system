import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { UrlsEnum } from "@enums/index";
import { ScheduleDTO } from "@dtos/index";

export interface NewSchedule {
  companyId: string;
  categoryId: string;
  userId: string;
  productIds: string[];
  days: {
    weekday: string;
    initialTime: string;
    endTime: string;
  }[];
  active: boolean;
}

interface ServiceProps {
  companyId: string | undefined;
}

function buildUrl({ companyId }: ServiceProps): string {
  return `${UrlsEnum.SCHEDULES}?companyId=${companyId}`;
}

export async function fetchSchedules({
  companyId,
}: ServiceProps): Promise<ScheduleDTO[]> {
  try {
    const response = await api.get<ScheduleDTO[]>(buildUrl({ companyId }));
    return response.data;
  } catch (error: any) {
    throw new AppError("Não foi possível carregar os Dados");
  }
}

export async function fetchScheduleById(
  scheduleId: string
): Promise<ScheduleDTO> {
  try {
    const response = await api.get<ScheduleDTO>(
      `${UrlsEnum.SCHEDULES}/${scheduleId}`
    );
    return response.data;
  } catch (error: any) {
    throw new AppError("Não foi possível carregar o agendamento");
  }
}

type CreateSchedule = {
  newSchedule: any;
};

export async function createSchedule({
  newSchedule,
}: CreateSchedule): Promise<ScheduleDTO> {
  try {
    const response = await api.post<any>(UrlsEnum.SCHEDULES, newSchedule);
    return response.data;
  } catch (error: any) {
    throw new AppError("Não foi possível criar o agendamento");
  }
}
