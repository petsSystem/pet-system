import React from "react";

import Link from "next/link";

interface ResumeInfoItemProps {
  label?: string;
  value?: string;
  editLink?: string;
  helperText?: string;
  icon?: any;
}

const ResumeInfoItem: React.FC<ResumeInfoItemProps> = ({
  label,
  helperText,
  value,
  editLink,
  icon,
}) => {
  return (
    <li className="md:flex md:justify-between md:items-center py-2 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center">
        {icon && (
          <div className="w-7 h-7 rounded-full shrink-0 bg-gradient-to-tr from-primary-100 to-primary-100 mr-2">
            {icon}
          </div>
        )}
        <div className="flex flex-col">
          <div className="text-md text-slate-800 dark:text-slate-100 font-medium">
            {label}
          </div>
          <div className="text-sm text-slate-400 dark:text-slate-100 font-medium">
            {helperText}
          </div>
        </div>
      </div>
      <div className="text-md text-slate-600 dark:text-slate-400 ml-4">
        <span className="mr-3 text-sm text-slate-400">{value}</span>
        {editLink && (
          <Link
            className="font-medium text-primary-600 hover:text-primary-600 dark:hover:text-primary-600"
            href={editLink}
          >
            Alterar
          </Link>
        )}
      </div>
    </li>
  );
};

export default ResumeInfoItem;
