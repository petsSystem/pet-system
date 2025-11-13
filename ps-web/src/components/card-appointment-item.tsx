import React from "react";
import { AppointmentStatus } from "@dtos/AppointmentDTO";
import { getStatusAppointmentColor } from "@utils/appointment-utils";
import { IconTime } from "./icons";

interface CardProps {
  cliente: string;
  time: string;
  pet: string;
  nome: string;
  valor: number;
  status: string;
  codeStatus?: string;
  defaultChecked?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  cliente,
  pet,
  nome,
  valor,
  time,
  status,
  defaultChecked = false,
  codeStatus,
  onClick,
}) => {
  const colorStatus = getStatusAppointmentColor(
    codeStatus as AppointmentStatus
  );
  return (
    <label className="relative block cursor-pointer text-left w-full">
      <input
        type="radio"
        name="radio-buttons"
        className="peer sr-only"
        defaultChecked={defaultChecked}
        onClick={onClick}
      />
      <div className="p-4 rounded dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm duration-150 ease-in-out">
        <div className="grid grid-cols-12 items-center gap-x-2">
          {/* Card */}
          <div className="col-span-12 order-1 sm:order-none sm:col-span-6 flex items-center space-x-2 lg:sidebar-expanded:col-span-6 xl:sidebar-expanded:col-span-3">
            <div className=" flex gap-2 justify-center		">
              <div className="w-8 h-8 font-medium text-slate-800 dark:text-slate-100">
                {IconTime}
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="text-xs text-primary-800 font-bold">{time}</div>
                <div className="text-xs text-primary-800 font-bold">🐾</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                Cliente: {cliente}
              </div>
              <div className="text-xs">Pet: {pet}</div>
            </div>
          </div>

          <div className="col-span-6 order-2 sm:order-none sm:col-span-6 text-right lg:sidebar-expanded:hidden xl:sidebar-expanded:block">
            <div
              className={`text-xs inline-flex font-medium bg-${colorStatus}-100 dark:bg-${colorStatus}-400/30 text-${colorStatus}-600 dark:text-${colorStatus}-400 rounded-full text-center px-2.5 py-1`}
            >
              {status}
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0 border-2 border-transparent peer-checked:border-primary-400 dark:peer-checked:border-primary-100 rounded pointer-events-none"
        aria-hidden="true"
      ></div>
    </label>
  );
};

export default Card;
