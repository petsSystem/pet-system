import ModalBasic from "@components/modal-basic";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useCompany } from "@hooks/useCompany";
import { useProfile } from "@hooks/useProfile";

import { CompanyDTO } from "@dtos/CompanyDTO";
import { IconSearch } from "@components/icons";
import { PermissionContainer } from "@components/PermissionContainer";
import { ResourcesEnum } from "@enums/Resource";
import { ActionsEnum } from "@enums/Actions";

interface CompanyOptionProps {
  company: CompanyDTO;
  isCurrentCompany?: boolean;
  onClick: () => void;
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

const ModalCompanies: React.FC = () => {
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const { profile, updateProfile } = useProfile();
  const { companies, setSelectedCompanyLocally, findSelectedCompanyById } =
    useCompany();

  const [selectedCompanyId, setSelectedCompanyId] = useState<
    string | undefined
  >(profile?.companyId);

  const selectedCompany = findSelectedCompanyById(profile?.companyId);

  const route = useRouter();

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleCompanyAlter = () => {
    if (selectedCompanyId) {
      setSelectedCompanyLocally(selectedCompanyId);
      setCompanyModalOpen(false);
      updateProfile(selectedCompanyId);
      route.replace("/admin");
    }
  };

  return (
    <div className="m-1.5">
      <PermissionContainer
        resource={ResourcesEnum.COMPANY}
        action={ActionsEnum.SHOW}
      >
        <button
          className="btn text-white  ml-5"
          aria-controls="feedback-modal"
          onClick={() => setCompanyModalOpen(true)}
        >
          <div className="flex ">
            <span className="text-primary-600">{IconSearch}</span>
            <span className="text-primary-600 ml-2"> alterar PetShop</span>
          </div>
        </button>
      </PermissionContainer>
      <ModalBasic
        isOpen={companyModalOpen}
        setIsOpen={setCompanyModalOpen}
        title="PetShop a ser gerenciado:"
      >
        <div className="px-5 pt-4 pb-1">
          <div className="text-sm">
            <div className="mb-4">Selecione o PetShop:</div>
            <ul className="space-y-2 mb-4">
              {companies?.map((comp, index) => (
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
    </div>
  );
};

export default ModalCompanies;
