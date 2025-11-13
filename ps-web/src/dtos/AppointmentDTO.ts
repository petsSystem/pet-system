export enum AppointmentStatus {
  CREATED = "CREATED",
  CANCELLED = "CANCELLED",
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  CANCELLED_BY_CLIENT = "CANCELLED_BY_CLIENT",
  CANCELLED_BY_PETSHOP = "CANCELLED_BY_PETSHOP",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  DID_NOT_SHOW_UP = "DID_NOT_SHOW_UP",
  RESCHEDULED = "RESCHEDULED",
  AWAITING_CONFIRMATION = "AWAITING_CONFIRMATION",
}

export enum PaymentType {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  PIX = "PIX",
}

export enum PaymentStatus {
  PAID = "PAID",
  PENDING = "PENDING",
}

export interface AppointmentResponse {
  id: string;
  petName: string;
  customerName: string;
  scheduleId: string;
  userName: string;
  phone: string;
  productName: string;
  additionals: any[];
  date: string;
  time: string;
  paymentStatus: PaymentStatus;
  paymentType: string | null;
  status: AppointmentStatus;
  comments: string | null;
  amount: number;
  active: boolean | null;
}

export interface AppointmentScheduleDTO extends AppointmentResponse {
  companyId: string;
  categoryId: string;
  petId: string;
  customerId: string;
  userId: string;
  productId: string;
  additionalIds: string[];
}
