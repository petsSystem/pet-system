import {
  AppointmentStatus,
  PaymentStatus,
  PaymentType,
} from "@dtos/AppointmentDTO";

export function translatePaymentStatus(status: string): string {
  switch (status) {
    case "PENDING":
      return "Pendente";
    case "PAID":
      return "Pago";
    default:
      return "";
  }
}

export function translatePaymentType(type: PaymentType | null): string {
  switch (type) {
    case PaymentType.CASH:
      return "Dinheiro";
    case PaymentType.CREDIT_CARD:
      return "Cartão de crédito";
    case PaymentType.DEBIT_CARD:
      return "Cartão de débito";
    case PaymentType.PIX:
      return "PIX";
    default:
      return "";
  }
}

export function translateScheduleStatus(
  status: AppointmentStatus | null
): string {
  switch (status) {
    case AppointmentStatus.CREATED:
      return "Agendado";
    case AppointmentStatus.CANCELLED:
      return "Cancelado";
    case AppointmentStatus.SCHEDULED:
      return "Agendado";
    case AppointmentStatus.CONFIRMED:
      return "Confirmado";
    case AppointmentStatus.CANCELLED_BY_CLIENT:
      return "Cancelado pelo cliente";
    case AppointmentStatus.CANCELLED_BY_PETSHOP:
      return "Cancelado pelo petshop";
    case AppointmentStatus.IN_PROGRESS:
      return "Em atendimento";
    case AppointmentStatus.COMPLETED:
      return "Concluído";
    case AppointmentStatus.DID_NOT_SHOW_UP:
      return "Não compareceu";
    case AppointmentStatus.RESCHEDULED:
      return "Reagendado";
    case AppointmentStatus.AWAITING_CONFIRMATION:
      return "Aguardando confirmação";
    default:
      return "";
  }
}

export function getStatusAppointmentColor(
  status: AppointmentStatus | null
): string {
  switch (status) {
    case AppointmentStatus.CREATED:
      return "amber";
    case AppointmentStatus.CANCELLED:
      return "rose";
    case AppointmentStatus.SCHEDULED:
      return "amber"; // Agendado
    case AppointmentStatus.CONFIRMED:
      return "emerald"; // Confirmado
    case AppointmentStatus.CANCELLED_BY_CLIENT:
    case AppointmentStatus.CANCELLED_BY_PETSHOP:
    case AppointmentStatus.DID_NOT_SHOW_UP:
      return "rose"; // Cancelado
    case AppointmentStatus.IN_PROGRESS:
      return "amber"; // Em andamento
    case AppointmentStatus.COMPLETED:
      return "emerald"; // Concluído com sucesso
    case AppointmentStatus.RESCHEDULED:
      return "amber";
    default:
      return "";
  }
}

export function getPaymentStatusColor(
  status: PaymentStatus | undefined
): string {
  switch (status) {
    case "PENDING":
      return "amber";
    case "PAID":
      return "emerald";
    default:
      return "";
  }
}
