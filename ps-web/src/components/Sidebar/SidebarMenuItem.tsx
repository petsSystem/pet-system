import React from "react";
import Link from "next/link";

interface SidebarMenuItemProps {
  to: string;
  pathname: string;
  isActive: boolean;
  label: string;
  icon: any;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  to,
  pathname,
  isActive,
  label,
  icon,
}) => {
  // const isActive = pathname === to;

  return (
    <Link
      href={to}
      className={`text-slate-200  group relative flex items-center  rounded-sm p-4 font-medium duration-300 ease-in-out hover:bg-slate-700 dark:hover:bg-meta-4 hover:text-primary-500 ${
        isActive ? "bg-slate-500 dark:bg-meta-4 text-primary-500" : ""
      }`}
    >
      {icon}
      <h1 className="ml-3 hidden lg:flex">{label}</h1>
    </Link>
  );
};

export default SidebarMenuItem;
