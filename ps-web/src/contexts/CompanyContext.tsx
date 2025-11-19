"use client";
import { CompanyDTO } from "@dtos/CompanyDTO";
import { api } from "@services/api";
import { createContext, ReactNode, useState } from "react";
import { useProfile } from "@hooks/useProfile";
import { UrlsEnum } from "../enums";

interface CompanyContextProps {
  getCompanies: () => Promise<any>;
  getAllCompanies: () => Promise<CompanyDTO[]>;
  setSelectedCompanyLocally: (id: string) => void;
  findSelectedCompanyById: (
    companyId: string | undefined
  ) => CompanyDTO | undefined;
  companies: CompanyDTO[] | null | undefined;
  selectedCompany: CompanyDTO | undefined;
  updateCompany: (company: CompanyDTO) => void;
  createCompany: (company: Omit<CompanyDTO, 'id'>) => Promise<CompanyDTO>;
  deleteCompany: (id: string) => Promise<void>;
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

  async function getAllCompanies(): Promise<CompanyDTO[]> {
    try {
      const { data } = await api.get(UrlsEnum.COMPANIES);
      return data.content || [];
    } catch (error) {
      throw error;
    }
  }

  async function createCompany(companyData: Omit<CompanyDTO, 'id'>): Promise<CompanyDTO> {
    try {
      const { data } = await api.post(UrlsEnum.COMPANIES, companyData);
      setCompanies(prev => [...prev, data]);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function deleteCompany(id: string): Promise<void> {
    try {
      await api.delete(`${UrlsEnum.COMPANIES}/${id}`);
      setCompanies(prev => prev.filter(company => company.id !== id));
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
        getAllCompanies,
        setSelectedCompanyLocally,
        selectedCompany,
        updateCompany,
        createCompany,
        deleteCompany,
        findSelectedCompanyById,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
