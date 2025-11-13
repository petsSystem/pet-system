"use client";
import { CompanyDTO } from "@dtos/CompanyDTO";
import { api } from "@services/api";
import { createContext, ReactNode, useState } from "react";
import { useProfile } from "@hooks/useProfile";
import { UrlsEnum } from "../enums";

interface CompanyContextProps {
  getCompanies: () => Promise<any>;
  setSelectedCompanyLocally: (id: string) => void;
  findSelectedCompanyById: (
    companyId: string | undefined
  ) => CompanyDTO | undefined;
  companies: CompanyDTO[] | null | undefined;
  selectedCompany: CompanyDTO | undefined;
  updateCompany: (company: CompanyDTO) => void;
}

export const CompanyContext = createContext<CompanyContextProps>(
  {} as CompanyContextProps
);

export const CompanyProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { profile } = useProfile();
  const [companies, setCompanies] = useState<CompanyDTO[]>([] as CompanyDTO[]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyDTO>();

  async function getCompanies() {
    try {
      const { data } = await api.get(UrlsEnum.COMPANIES);
      const companiesData = data.content;

      if (companiesData.length > 0) {
        setCompanies(companiesData);
        if (profile) {
          setSelectedCompanyLocally(profile?.companyId);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  const findCompanyById = (
    companyId: string,
    companies: CompanyDTO[]
  ): CompanyDTO | undefined => {
    return companies.find((company) => company.id === companyId);
  };

  const findSelectedCompanyById = (
    companyId: string | undefined
  ): CompanyDTO | undefined => {
    return companies.find((company) => company.id === companyId);
  };

  function setSelectedCompanyLocally(id: string) {
    const foundCompany = findCompanyById(id, companies);
    setSelectedCompany(foundCompany);
  }

  const updateCompany = (updatedCompany: CompanyDTO) => {
    const updatedCompanies = companies.map((company) =>
      company.id === updatedCompany.id ? updatedCompany : company
    );
    setCompanies(updatedCompanies);

    if (selectedCompany?.id === updatedCompany.id) {
      setSelectedCompany(updatedCompany);
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        companies: companies,
        getCompanies,
        setSelectedCompanyLocally,
        selectedCompany,
        updateCompany,
        findSelectedCompanyById,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
