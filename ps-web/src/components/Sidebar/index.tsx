"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Transition } from "@headlessui/react";

import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import SidebarMenuItem from "./SidebarMenuItem";
import { useAuth } from "@hooks/useAuth";
import { useProfile } from "@hooks/useProfile";
import { useApp } from "@hooks/useApp";

import SidebarLink from "./sidebar-link";

import { sidebarRoutes } from "./utils/SideBarRoutes";

const Sidebar: React.FC = () => {
  const sidebar = useRef<HTMLDivElement>(null);

  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const { sidebarOpen, setSidebarOpen } = useApp();

  const pathname = usePathname();
  const { signOut } = useAuth();
  const { profile } = useProfile();

  // Filtrar as rotas com base nas permissões
  const filteredRoutes = profile?.permissions
    .filter((permission) => permission.resource)
    .map((permission) => permission.resource);

  if (!filteredRoutes?.includes("ADMIN")) {
    filteredRoutes?.push("ADMIN");
  }

  const filteredRoutesPages = sidebarRoutes.filter((route) =>
    filteredRoutes?.includes(route.resource)
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!sidebar.current) return;
      if (!sidebarOpen || sidebar.current.contains(target as Node)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <>
      {/* menu aberto */}
      <aside className="lg:w-64 min-h-screen bg-white  ">
        <div
          className={`flex flex-col h-screen hidden md:flex bg-slate-800 transition-all duration-200 ease-in-out`}
        >
          <SidebarHeader />
          <SidebarMenu pathname="/">
            {filteredRoutesPages.map((route) => (
              <SidebarMenuItem
                key={route.to}
                to={route.to}
                pathname={pathname}
                isActive={pathname.includes(route.to)}
                label={route.label}
                icon={route.icon}
              />
            ))}
          </SidebarMenu>
          <div className="flex items-center justify-center mt-auto py-4 px-4"></div>
        </div>
      </aside>

      {/* mobile */}
      <div
        className={`flex md:hidden min-w-fit ${
          sidebarExpanded ? "sidebar-expanded" : ""
        }`}
      >
        {/* Sidebar backdrop (mobile only) */}
        <Transition
          className="fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto"
          show={sidebarOpen}
          enter="transition-opacity ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-out duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          aria-hidden="true"
        />

        {/* Sidebar */}
        <Transition
          show={sidebarOpen}
          unmount={false}
          as="div"
          id="sidebar"
          ref={sidebar}
          className="flex lg:!flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          {/* Sidebar header */}
          <div className="flex justify-between mb-10 pr-3 sm:px-2">
            <button
              className="lg:hidden text-slate-500 hover:text-slate-400"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
              </svg>
            </button>
            {/* <Logo /> */}
          </div>

          {/* Links */}
          {filteredRoutesPages.map((route, index) => (
            <li
              key={index}
              className={`px-3 rounded-sm mb-0.5 last:mb-0 list-none`}
            >
              <SidebarLink href={route.to}>
                <div
                  className={`group relative flex items-center  rounded-sm p-4 font-medium duration-300 ease-in-out hover:bg-slate-700 dark:hover:bg-meta-4 hover:text-primary-500 ${
                    pathname.includes(route.to)
                      ? "bg-slate-500 dark:bg-meta-4 text-primary-500"
                      : ""
                  }`}
                >
                  {route.icon}
                  <span
                    className={`text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${
                      pathname.includes(route.to)
                        ? "bg-slate-500 dark:bg-meta-4 text-primary-500"
                        : ""
                    }`}
                  >
                    {route.label}
                  </span>
                </div>
              </SidebarLink>
            </li>
          ))}

          {/* Expand / collapse button */}
          <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
            <div className="px-3 py-2">
              <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
                <span className="sr-only">Expand / collapse sidebar</span>
                <svg
                  className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="text-slate-400"
                    d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                  />
                  <path className="text-slate-600" d="M3 23H1V1h2z" />
                </svg>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </>
  );
};

export default Sidebar;
