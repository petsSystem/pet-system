"use client";

import Link from "next/link";
import SchedulingHeader from "../scheduling-header";
import SchedulingImage from "../scheduling-image";
import SchedulingProgress from "../scheduling-progress";

export default function Scheduling04() {
  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="relative flex">
        {/* Content */}
        <div className="w-full">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            <div className="flex-1">
              <SchedulingHeader />
              <SchedulingProgress step={6} />
            </div>

            <div className="px-4 py-8">
              <div className="max-w-md mx-auto">
                <div className="text-center">
                  <svg
                    className="inline-flex w-16 h-16 fill-current mb-6"
                    viewBox="0 0 64 64"
                  >
                    <circle
                      className="text-emerald-100 dark:text-emerald-400/30"
                      cx="32"
                      cy="32"
                      r="32"
                    />
                    <path
                      className="text-emerald-500 dark:text-emerald-400"
                      d="m28.5 41-8-8 3-3 5 5 12-12 3 3z"
                    />
                  </svg>
                  <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-8">
                    Agendamento realizado. 🙌
                  </h1>
                  <Link
                    className="btn bg-primary-500 hover:bg-primary-600 text-white"
                    href="/admin"
                  >
                    Ir para o Dash -&gt;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <OnboardingImage /> */}
      </div>
    </main>
  );
}
