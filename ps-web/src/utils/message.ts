import { statusList } from "./status-list";
import { AppointmentResponse } from "./../dtos/AppointmentDTO";
type MsgProps = {
  number: string;
  message: string;
};

export function sendMessageToWhatsApp({ number, message }: MsgProps): void {
  // Verifica se o número de telefone está formatado corretamente
  const formattedNumber = number.replace(/\D/g, ""); // Remove caracteres não numéricos

  // Verifica se o número de telefone é válido
  if (!formattedNumber || formattedNumber.length < 10) {
    console.error("Número de telefone inválido");
    return;
  }

  // Abre o link do WhatsApp Web com o número de telefone e a mensagem
  const url = `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(
    message
  )}`;

  // Abre uma nova janela do navegador com o link do WhatsApp Web
  window.open(url, "_blank");
}

// export function generatePetshopMessage(
//   appointment: AppointmentResponse
// ): string {
//   const status = appointment.status.toLowerCase();

//   let message = `Olá ${appointment.customerName},\n\n`;
//   message += `Queremos informar que o atendimento para o pet ${appointment.petName} esta como ${status}.\n`;
//   message += `Detalhes do agendamento:\n`;
//   message += `- Data: ${appointment.date}\n`;
//   message += `- Horário: ${appointment.time}\n`;
//   message += `- Serviço: ${appointment.productName}\n`;
//   if (appointment.comments) {
//     message += `- Observação: ${appointment.comments}\n`;
//   }
//   message += `\nAtt,\n${appointment.userName}`;

//   return message;
// }

export function generatePetshopMessage(
  appointment: AppointmentResponse
): string {
  const { petName, customerName, productName, date, time, status } =
    appointment;

  let message = `Olá ${customerName}, queremos compartilhar uma atualização sobre o seu querido(a) ${petName}!\n\n`;

  const statusInfo = statusList.find((item) => item.id === status);
  if (statusInfo) {
    message += `📅 *Data do Serviço:* ${date}\n⏰ *Horário agendado:* ${time}\n🐾 *Status:* ${statusInfo.status}\n📋 *Descrição:* ${statusInfo.description}`;
  }

  return message;
}

// // Exemplo de uso da função
// const phoneNumber = "+551234567890"; // Substitua pelo número de telefone do destinatário
// const defaultMessage = "Olá! Como você está?"; // Mensagem padrão a ser enviada
// sendMessageToWhatsApp(phoneNumber, defaultMessage);
