import { useContext } from "react";
import { AppointmentContext } from "@contexts/AppointmentContext";

export function useAppointment() {
  const context = useContext(AppointmentContext);

  return context;
}
