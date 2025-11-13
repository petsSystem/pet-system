export interface ScheduleDTO {
  id: string;
  companyId: string;
  categoryId: string;
  userId: string;
  productIds: string[];
  days: ScheduleDayDTO[];
  active: boolean;
}

export interface ScheduleDayDTO {
  weekday?: string;
  initialTime: string;
  endTime: string;
  isOpen?: boolean;
}
