"use client";
import { createContext, useContext, useState } from "react";

interface CalendarContextProps {
  today: Date;
  currentMonth: number;
  setCurrentMonth: (currentMonth: number) => void;
  currentYear: number;
  setCurrentYear: (currentMonth: number) => void;
  setDaysInMonthState: (daysInMonth: number) => void;
  daysInMonthState: number;
}

export const CalendarContext = createContext<CalendarContextProps | undefined>(
  {} as CalendarContextProps
);

export const CalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [daysInMonthState, setDaysInMonthState] = useState<number>(0);
  return (
    <CalendarContext.Provider
      value={{
        today,
        currentMonth,
        setCurrentMonth,
        currentYear,
        setCurrentYear,
        setDaysInMonthState,
        daysInMonthState,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
