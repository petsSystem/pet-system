// Crie um arquivo chamado, por exemplo, ScheduleDTO.ts

export type Weekday =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export type TypeService = "PETCARE" | "PETVET" | "PETFOOD" | "PETSERV";

export interface DayDTO {
  weekday: Weekday;
  initialTime: string;
  endTime: string;
  simultaneous: number | undefined;
  intervalMinutes: number;
}

export interface CategoryDTO {
  id: string;
  type: TypeService;
  label: string;
  description: string;
  days: DayDTO[];
  active?: boolean;
  companyId?: string;
}
