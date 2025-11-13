"use client";
import React from "react";
import { ColorDot } from ".";
import { IconDog, IconSearch } from "./icons";

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Empty State",
  description = "",
  buttonText = "Add Event",
  onButtonClick,
}) => {
  return (
    <div className="relative bg-white dark:bg-slate-900 h-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="">
          <div className="max-w-2xl m-auto mt-16">
            <div className="text-center px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 mb-4">
                {IconDog}
              </div>
              <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-2">
                {title}
              </h2>
              <div className="mb-6">{description}</div>
              {onButtonClick && (
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-center gap-2">
                  <button
                    className="btn bg-primary-500 hover:bg-primary-600 text-white"
                    onClick={onButtonClick}
                  >
                    <svg
                      className="w-4 h-4 fill-current opacity-50 shrink-0"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="ml-2">{buttonText}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
