"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useProfile } from "@hooks/useProfile";
import HeaderContent from "@components/ps-header-content";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import Table from "@components/ps-table";
import { checkPermission } from "@utils/checkPermission";

import { ResourcesEnum, ActionsEnum, UrlsEnum } from "@enums/index";
import { CompanyDTO } from "@dtos/CompanyDTO";

const columns = [
  { key: "name", title: "Nome" },
  { key: "cnpj", title: "CNPJ", mask: "99.999.999/9999-99" },
  { key: "phone", title: "Telefone", mask: "(99)99999-9999" },
  { key: "address.city", title: "Cidade" },
  { key: "address.state", title: "Estado" },
  { key: "active", title: "Status", color: true, type: "status" },
];

export default function Companies() {
  const [isLoading, setIsLoading] = useState(false);
  const [filteredArray, setFilteredArray] = useState<CompanyDTO[]>([]);
  const [data, setData] = useState<CompanyDTO[]>([]);

  const route = useRouter();
  const { profile } = useProfile();

  async function getData() {
    try {
      setIsLoading(true);
      const response = await api.get(UrlsEnum.COMPANIES);
      setData(response.data.content);
      setFilteredArray(response.data.content);
    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar as empresas";
      console.error(title, error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleSearch = (searchValue: string) => {
    const lowerCaseSearch = searchValue.toLowerCase();

    const filtered = !!searchValue?.length
      ? data.filter((item) => 
          item.name.toLowerCase().includes(lowerCaseSearch) ||
          item.cnpj?.toLowerCase().includes(lowerCaseSearch)
        )
      : data;

    setFilteredArray(filtered);
  };

  function handleEdit(company: CompanyDTO) {
    route.push(`/companies/${company.id}?action=edit`);
  }

  function handleView(company: CompanyDTO) {
    route.push(`/companies/${company.id}?action=view`);
  }

  function handleAdd() {
    route.push(`/companies/0?action=add`);
  }



  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      <HeaderContent
        title="Empresas"
        searchPlaceholder="Pesquisar empresas"
        buttonLabel="Nova empresa"
        onButtonClick={() => handleAdd()}
        onSearch={handleSearch}
      />
      <Table
        columns={columns}
        data={filteredArray}
        loading={isLoading}
        onView={
          checkPermission({
            resource: ResourcesEnum.COMPANY,
            action: ActionsEnum.SHOW,
            permissions: profile?.permissions,
          })
            ? handleView
            : undefined
        }
        onEdit={
          checkPermission({
            resource: ResourcesEnum.COMPANY,
            action: ActionsEnum.EDIT,
            permissions: profile?.permissions,
          })
            ? handleEdit
            : undefined
        }
      />
    </div>
  );
}