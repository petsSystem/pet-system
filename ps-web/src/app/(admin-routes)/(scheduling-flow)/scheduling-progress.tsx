import { useAppointment } from "@/src/hooks/useAppointment";
import Link from "next/link";
import React from "react";

interface StepProps {
  step: number;
  href: string;
  active: boolean;
  label: string;
}

const Step: React.FC<StepProps> = ({ step, href, active, label }) => (
  <li className="flex flex-col justify-items-center">
    <Link
      href={href}
      passHref
      className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
        active
          ? "bg-primary-500 text-white"
          : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
      }`}
    >
      {step}
    </Link>
  </li>
);

interface OnboardingProgressProps {
  step?: number;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  step = 1,
}) => {
  const { setAppointmentUser, schedulingFormData } = useAppointment();

  const steps = [
    { step: 1, href: "/scheduling-01", label: "Categoria" }, //categoria
    { step: 2, href: "/scheduling-02", label: "Cliente" }, //cliente + pet
    { step: 3, href: "/scheduling-03", label: "Serviço" }, //produto + opcional
    { step: 4, href: "/scheduling-04", label: "Profissional" }, //profissional
    { step: 5, href: "/scheduling-05", label: "Calendário" },
    { step: 6, href: "/scheduling-05", label: "Resumo" },
    { step: 7, href: "/scheduling-06", label: "Final" },
  ];

  return (
    <div className="px-4 pb-4">
      <div className="max-w-md mx-auto w-full">
        <div className="relative">
          <div
            className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-slate-200 dark:bg-slate-700"
            aria-hidden="true"
          ></div>
          <ul className="relative flex justify-between w-full">
            {steps.map(({ step: stepNumber, href, label }) => (
              <Step
                key={stepNumber}
                step={stepNumber}
                href={href}
                active={step >= stepNumber}
                label={label}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OnboardingProgress;
