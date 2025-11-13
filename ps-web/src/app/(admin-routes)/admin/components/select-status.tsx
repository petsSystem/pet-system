"use client";
import { IconDog, IconPaw } from "@/src/components/icons";
import React, { useState } from "react";

interface StatusItem {
  id: string;
  status: string;
  description: string;
}

interface SelectStatusProps {
  statuses: StatusItem[];
  onClick: (status: string) => void;
  cancelButtonText?: string;
  changeStatusButtonText?: string;
  containerClassName?: string;
  buttonClassName?: string;
}

const SelectStatus: React.FC<SelectStatusProps> = ({
  statuses,
  onClick,
  cancelButtonText = "Cancelar",
  changeStatusButtonText = "Alterar Status",
  containerClassName = "",
  buttonClassName = "",
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleClick = (status: string) => {
    setSelectedStatus(status);
  };

  return (
    <div className={`px-5 pb-1 ${containerClassName}`}>
      <div className="text-sm">
        {/* Options */}
        <ul className="space-y-2 mb-4">
          {statuses.map((statusItem) => (
            <li key={statusItem.id}>
              <button
                className={`w-full h-full text-left py-3 px-4 rounded ${
                  selectedStatus === statusItem.id
                    ? "text-primary-800 dark:text-primary-100 border-2 border-primary-300 dark:border-primary-600"
                    : "text-slate-800 dark:text-slate-100 border-2 border-gray-300 dark:border-gray-600"
                } ${buttonClassName}`}
                onClick={() => handleClick(statusItem.id)}
              >
                <div className="flex items-center">
                  {/* <div className="w-4 h-4 border-4 bg-white border-primary-500 rounded-full mr-3"></div>
                   */}
                  <span className="w-8 h-8 text-primary-500 mr-2">
                    {IconPaw}
                  </span>
                  <div className="grow">
                    <div className="flex flex-wrap items-center justify-between mb-0.5">
                      <span className="font-medium">{statusItem.status}</span>
                      <span className="text-slate-600"></span>
                    </div>
                    <div className="text-xs">{statusItem.description}</div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Modal footer */}
      <div className="px-5 py-4">
        <div className="flex flex-wrap justify-end space-x-2">
          <button
            className="btn-sm bg-primary-500 hover:bg-primary-600 text-white"
            onClick={() => onClick(selectedStatus)}
          >
            {changeStatusButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectStatus;
