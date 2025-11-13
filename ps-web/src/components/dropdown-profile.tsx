"use client";

import { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";

import Image from "next/image";

import { useCompany } from "@hooks/useCompany";
import { useProfile } from "@hooks/useProfile";
import { useAuth } from "@hooks/useAuth";

import ModalBasic from "@components/modal-basic";

import { CompanyDTO } from "@dtos/CompanyDTO";

interface CompanyOptionProps {
  company: CompanyDTO;
  isCurrentCompany?: boolean;
  onClick: () => void;
}

export default function DropdownProfile({
  align,
}: {
  align?: "left" | "right";
}) {
  const [companyModalOpen, setCompanyModalOpen] = useState(false);

  const route = useRouter();
  const { signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { companies, setSelectedCompanyLocally, findSelectedCompanyById } =
    useCompany();

  const companySelected = findSelectedCompanyById(profile?.companyId);

  const [selectedCompanyId, setSelectedCompanyId] = useState<
    string | undefined
  >(profile?.companyId);

  const handleSignOut = () => {
    signOut();
  };

  function handleProfile() {
    route.push(`/profile`);
  }

  const handleCompanyAlter = () => {
    if (selectedCompanyId) {
      setSelectedCompanyLocally(selectedCompanyId);
      setCompanyModalOpen(false);
      updateProfile(selectedCompanyId);
      route.replace("/admin");
    }
  };

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  return (
    <Menu as="div" className="relative inline-flex">
      <Menu.Button className="inline-flex justify-center items-center group">
        <Image
          className="w-8 h-8 rounded-full"
          src={"/paw.svg"}
          width={32}
          height={32}
          alt="User"
        />
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-200">
            {companySelected?.name}
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </Menu.Button>
      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-[11rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }`}
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200 dark:border-slate-700">
          <div className="font-medium text-slate-800 dark:text-slate-100">
            {profile?.name}.
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 italic">
            {profile?.role}
          </div>
        </div>
        <Menu.Items as="ul" className="focus:outline-none">
          <Menu.Item as="li">
            {({ active }) => (
              <button
                onClick={() => setCompanyModalOpen(true)}
                className={`font-medium text-sm flex items-center py-1 px-3 ${
                  active ? "text-gray-600 dark:text-gray-400" : "text-gray-500"
                }`}
              >
                Alternar PetShop
              </button>
            )}
          </Menu.Item>
          <Menu.Item as="li">
            {({ active }) => (
              <button
                onClick={handleProfile}
                className={`font-medium text-sm flex items-center py-1 px-3 ${
                  active ? "text-gray-600 dark:text-gray-400" : "text-gray-500"
                }`}
              >
                Perfil
              </button>
            )}
          </Menu.Item>
          <Menu.Item as="li">
            {({ active }) => (
              <button
                onClick={handleSignOut}
                className={`font-medium text-sm flex items-center py-1 px-3 ${
                  active ? "text-red-600 dark:text-red-400" : "text-red-500"
                }`}
              >
                Sair
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
      <ModalBasic
        isOpen={companyModalOpen}
        setIsOpen={setCompanyModalOpen}
        title="PetShop a ser gerenciado:"
      >
        <div className="px-5 pt-4 pb-1">
          <div className="text-sm">
            <div className="mb-4">Selecione o PetShop:</div>
            <ul className="space-y-2 mb-4">
              {companies
                ?.filter((company) => company.name !== "SYSTEM COMPANY")
                ?.map((comp, index) => (
                  <CompanyOption
                    key={index}
                    company={comp}
                    isCurrentCompany={comp?.id === selectedCompanyId}
                    onClick={() => handleSelectCompany(comp?.id)}
                  />
                ))}
            </ul>
            <div className="text-xs text-slate-500">
              Selecione o PetShop que você gostaria de gerenciar no momento.
            </div>
          </div>
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-wrap justify-end space-x-4">
            <button
              className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 rounded-sm"
              onClick={() => setCompanyModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn-sm bg-primary-500 hover:bg-primary-600 text-white p-1 rounded-sm"
              onClick={handleCompanyAlter}
            >
              Alterar
            </button>
          </div>
        </div>
      </ModalBasic>
    </Menu>
  );
}

const CompanyOption: React.FC<CompanyOptionProps> = ({
  company,
  isCurrentCompany,
  onClick,
}) => (
  <li>
    <button
      className={`w-full h-full text-left py-3 px-4 rounded ${
        isCurrentCompany
          ? "bg-white dark:bg-slate-800 border-2 border-primary-400 dark:border-primary-500"
          : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
      } shadow-sm duration-150 ease-in-out`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div
          className={`w-4 h-4 border-4 bg-white ${
            isCurrentCompany
              ? "border-primary-500"
              : "border-slate-300 dark:border-slate-600"
          } rounded-full mr-3`}
        ></div>
        <div className="grow">
          <div className="flex flex-wrap items-center justify-between mb-0.5">
            <span
              className={`font-semibold ${
                isCurrentCompany
                  ? "text-slate-800 dark:text-slate-100"
                  : "text-slate-800 dark:text-slate-100"
              }`}
            >
              {company?.name}{" "}
              {isCurrentCompany && (
                <span className="text-xs italic text-slate-500 align-top">
                  PetShop Atual
                </span>
              )}
            </span>
            <span className="text-slate-600">
              <span
                className={`font-medium ${
                  company?.active ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {company?.active ? "Ativa" : "Inativo"}
              </span>
            </span>
          </div>
          <div className="text-sm">{`${company.address?.street}, ${company?.address?.number} - ${company?.address?.city}`}</div>
        </div>
      </div>
    </button>
  </li>
);
