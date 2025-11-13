import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { IconHour, IconTime } from "./icons";

interface CardProps {
  id: number;
  label: string;
  details: string;
  date: string;
  type: string;
}

export default function CardCalendarItem({ data }: { data: CardProps }) {
  return (
    <div
      className={`rounded-sm border px-5 py-2 ${
        data.type === "Featured"
          ? "bg-amber-50 dark:bg-amber-400/10 border-amber-300 dark:border-amber-400/50"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
      }`}
    >
      <div className="md:flex justify-between items-center space-y-2 md:space-y-0 space-x-2">
        {/* Left side */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="gap-2 items-center flex">
            <span className="w-6 h-6">{IconTime}</span>
            <span className="text-primary-800 font-semibold ">8:30</span>
          </div>
          <div>
            <div className="inline-flex font-semibold text-slate-800 dark:text-slate-100">
              {data.label}
            </div>
            <div className="text-sm">{data.details}</div>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center space-x-4 pl-10 md:pl-0">
          {data.type && (
            <div
              className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${
                data.type === "Featured"
                  ? "bg-amber-100 dark:bg-amber-400/30 text-amber-600 dark:text-amber-400"
                  : "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {data.type}
            </div>
          )}
          <button
            className={`text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500`}
          >
            <svg
              className="w-3 h-4 fill-current"
              width="12"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 0C.9 0 0 .9 0 2v14l6-3 6 3V2c0-1.1-.9-2-2-2H2Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
