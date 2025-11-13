"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useProfile } from "@hooks/useProfile";
import { useCompany } from "@hooks/useCompany";

import HeaderContent from "@components/ps-header-content";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import Table from "@components/ps-table";
import { SkeletonTable } from "@components/skeleton";
import { checkPermission } from "@utils/checkPermission";

import { ResourcesEnum, ActionsEnum, UrlsEnum } from "@enums/index";
import { CategoryDTO, UserDTO } from "@dtos/index";
import { TableColumn } from "@/src/components/ps-table";

type UserAction = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  active: boolean;
};

const columns = [
  { key: "name", title: "Nome" },
  { key: "cpf", title: "CPF", mask: "999.999.999-99" },
  { key: "email", title: "E-mail" },
  { key: "active", title: "Status", color: true, type: "status" },
];

export default function Users() {
  const [isLoading, setIsLoading] = useState(false);
  const [filteredArray, setFilteredArray] = useState<UserDTO[]>([]);
  const [data, setData] = useState<UserDTO[]>([] as UserDTO[]);

  const route = useRouter();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();

  const selectedCompany = findSelectedCompanyById(profile?.companyId);

  async function getData() {
    try {
      setIsLoading(true);

      const response = await api.get(
        `${UrlsEnum.USERS}?companyId=${selectedCompany?.id}`
      );
      setData(response.data.content);
      setFilteredArray(response.data.content);
    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os Dados";
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
      ? data.filter((item) => item.name.toLowerCase().includes(lowerCaseSearch))
      : data;

    setFilteredArray(filtered);
  };

  function handleEdit(user: UserAction) {
    route.push(`/user/${user.id}?action=edit`);
  }
  function handleDelete(user: UserAction) {
    route.push(`/user/${user.id}?action=delete`);
  }
  function handleView(user: UserAction) {
    route.push(`/user/${user.id}?action=view`);
  }
  function handleAdd() {
    route.push(`/user/0?action=add`);
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <HeaderContent
          title="Usuários"
          searchPlaceholder="Pesquisar Usuários"
          buttonLabel="Novo Usuário"
          onButtonClick={() => handleAdd()}
          onSearch={handleSearch}
        />
        <Table
          columns={columns}
          data={filteredArray}
          loading={isLoading}
          onView={
            checkPermission({
              resource: ResourcesEnum.CATEGORY,
              action: ActionsEnum.SHOW,
              permissions: profile?.permissions,
            })
              ? handleView
              : undefined
          }
          onEdit={
            checkPermission({
              resource: ResourcesEnum.CATEGORY,
              action: ActionsEnum.EDIT,
              permissions: profile?.permissions,
            })
              ? handleEdit
              : undefined
          }
        />
      </div>
    </>
  );
}
