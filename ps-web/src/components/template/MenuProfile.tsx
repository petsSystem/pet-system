import { Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { IconBell, IconLogout, IconUser } from "@components/icons";
import { useAuth } from "@hooks/useAuth";
import { useRouter } from "next/navigation";

import { useCompany } from "@hooks/useCompany";
import { useProfile } from "@hooks/useProfile";

import ModalCompanies from "./companies/ModalCompanies";

function classNames(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function MenuProfile() {
  const { signOut } = useAuth();
  const route = useRouter();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();

  const handleSignOut = () => {
    signOut();
  };

  function handleProfile() {
    route.push(`/profile`);
  }

  const companySelected = findSelectedCompanyById(profile?.companyId);

  return (
    <>
      <Disclosure as="nav" className="w-full">
        {({ open }) => (
          <>
            <div className="mx-auto px-2 sm:px-6 lg:px-8 ">
              <div className="relative flex h-16 items-center justify-between">
                <div className="relative flex">
                  <h1 className="text-2xl md:text-2xl text-gray-800 font-bold ">
                    {companySelected?.name}👋
                  </h1>
                  <ModalCompanies />
                </div>

                <div className="flex items-center ml-auto">
                  <button
                    type="button"
                    className="relative rounded-full p-1 text-gray-400 hover:text-primary-500"
                  >
                    {IconBell}
                  </button>

                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-primary-700 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <span className="h-12 w-12 rounded-full overflow-hidden border border-width-2 rounded-full border-primary-500">
                          <Image
                            src="/user.png"
                            alt="Logo"
                            width={100}
                            height={100}
                          />
                        </span>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0  mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-40">
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              className={`flex items-center justify-center mt-auto py-2 px-2 ${
                                active ? "bg-gray-100" : ""
                              }`}
                            >
                              {IconUser}
                              <button
                                onClick={handleProfile}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "flex px-4 py-2 text-sm text-gray-700 w-full"
                                )}
                              >
                                Perfil
                              </button>
                            </div>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }) => (
                            <div
                              className={`flex items-center justify-center mt-auto py-2 px-2 ${
                                active ? "bg-gray-100" : ""
                              }`}
                            >
                              {IconLogout}
                              <button
                                onClick={handleSignOut}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "flex px-4 py-2 text-sm text-gray-700 w-full"
                                )}
                              >
                                Sair
                              </button>
                            </div>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </>
  );
}
