"use client";
import { useEffect, useState } from "react";
import { CalendarProperties } from "./calendar-properties";

export interface Event {
  eventStart: Date;
  eventEnd: Date | null;
  eventName: string;
  eventColor: string;
}

interface CalendarTableProps {
  events?: Event[];
  size?: "small" | "medium" | "large";
  onDayClick: (day: Date) => void;
  disabledDays?: { [date: string]: boolean };
}

export default function CalendarTable({
  events = [],
  size = "large",
  onDayClick,
  disabledDays = {},
}: CalendarTableProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const {
    dayNames,
    currentYear,
    currentMonth,
    daysInMonth,
    startingBlankDays,
    endingBlankDays,
    eventColor,
    isToday,
    renderDays,
  } = CalendarProperties();

  const getEvents = (date: number) => {
    return events.filter(
      (e) =>
        new Date(e.eventStart).toDateString() ===
        new Date(currentYear, currentMonth, date).toDateString()
    );
  };

  useEffect(() => {
    renderDays();
  }, [currentMonth, currentYear]);

  const cellSizeClasses = {
    small: "h-16", // Tamanho pequeno
    medium: "h-28", // Tamanho médio (padrão)
    large: "h-36", // Tamanho grande
  };

  const handleDate = (day: number) => {
    const dayMonth = new Date(currentYear, currentMonth, day);
    setSelectedDay(day);
    onDayClick(dayMonth);
  };

  const isDisabled = (day: number) => {
    // const dateString = `${currentYear}-${currentMonth + 1}-${day}`;
    const dateString = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    return disabledDays[dateString];
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-sm shadow overflow-hidden">
      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-px border-b border-slate-200 dark:border-slate-700">
        {dayNames.map((day) => {
          return (
            <div className="px-1 py-3" key={day}>
              <div className="text-slate-500 text-sm font-medium text-center lg:hidden">
                {day.substring(0, 3)}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium text-center hidden lg:block">
                {day}
              </div>
            </div>
          );
        })}
      </div>
      {/* Células do dia */}
      <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700">
        {startingBlankDays.map((blankday) => {
          return (
            <div
              className={`bg-slate-50 dark:bg-slate-800 ${cellSizeClasses[size]}`}
              key={blankday}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
              >
                <rect width="100%" height="100%" fill="url(#stripes)" />
              </svg>
            </div>
          );
        })}
        {daysInMonth.map((day) => {
          const disabled =
            Object.keys(disabledDays).length !== 0 ? isDisabled(day) : true;
          const isSelected = selectedDay === day;

          return (
            <button
              onClick={() => handleDate(day)}
              disabled={!disabled}
              className={`relative bg-white dark:bg-slate-800 ${
                cellSizeClasses[size]
              } overflow-hidden ${
                !disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } ${isSelected ? "border border-primary-200" : ""}`}
              key={day}
            >
              <div className="h-full flex flex-col justify-between">
                <div className="grow flex flex-col relative p-0.5 sm:p-1.5 overflow-hidden">
                  {getEvents(day).map((event) => {
                    return (
                      <button
                        className="relative w-full text-left mb-1"
                        key={event.eventName}
                      >
                        <div
                          className={`px-2 py-0.5 rounded overflow-hidden ${eventColor(
                            event.eventColor
                          )}`}
                        >
                          <div className="text-xs font-semibold truncate">
                            {event.eventName}
                          </div>
                          <div className="text-xs uppercase truncate hidden sm:block">
                            {event.eventStart && (
                              <span>
                                {event.eventStart.toLocaleTimeString([], {
                                  hour12: true,
                                  hour: "numeric",
                                  minute: "numeric",
                                })}
                              </span>
                            )}
                            {event.eventEnd && (
                              <span>
                                -{" "}
                                <span>
                                  {event.eventEnd.toLocaleTimeString([], {
                                    hour12: true,
                                    hour: "numeric",
                                    minute: "numeric",
                                  })}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-slate-800 to-transparent pointer-events-none"
                    aria-hidden="true"
                  ></div>
                </div>
                <div className="flex justify-between items-center p-0.5 sm:p-1.5">
                  {getEvents(day).length > 2 && (
                    <button className="text-xs text-slate-500 dark:text-slate-300 font-medium whitespace-nowrap text-center sm:py-0.5 px-0.5 sm:px-2 border border-slate-200 dark:border-slate-700 rounded">
                      <span className="md:hidden">+</span>
                      <span>{getEvents(day).length - 2}</span>{" "}
                      <span className="hidden md:inline">more</span>
                    </button>
                  )}
                  <button
                    className={`inline-flex ml-auto w-6 h-6 items-center justify-center text-xs sm:text-sm dark:text-slate-300 font-medium text-center rounded-full hover:bg-primary-100 dark:hover:bg-slate-600 ${
                      isToday(day) && "text-white sm:font-bold bg-primary-500 "
                    }`}
                  >
                    {day}
                  </button>
                </div>
              </div>
            </button>
          );
        })}
        {endingBlankDays.map((blankday) => {
          return (
            <div
              className={`bg-slate-50 dark:bg-slate-800 ${cellSizeClasses[size]}`}
              key={blankday}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
              >
                <rect width="100%" height="100%" fill="url(#stripes)" />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
