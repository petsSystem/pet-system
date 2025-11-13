import { useContext } from "react";
import { CalendarContext } from "@contexts/CalendarContext";

export function useCalendar() {
  const context = useContext(CalendarContext);

  return context;
}
