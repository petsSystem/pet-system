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
import { CategoryDTO } from "@dtos/index";
import { TableColumn } from "@/src/components/ps-table";
import { CategoriesEnum } from "@/src/enums/Categories";
import { useCategory } from "@/src/hooks/useCategory";

const columns = [
  { key: "label", title: "Categoria" },
  { key: "description", title: "Descrição" },
  { key: "active", title: "Status", color: true, type: "status" },
];

type CategoryPet = {
  id: string;
  type: keyof typeof CategoriesEnum;
  description: string;
  active: boolean;
};

export default function Categories() {
  const [isLoading, setIsLoading] = useState(false);
  const [filteredArray, setFilteredArray] = useState<CategoryDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>(
    [] as CategoryDTO[]
  );

  const route = useRouter();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();

  const selectedCompany = findSelectedCompanyById(profile?.companyId);

  async function getData() {
    try {
      setIsLoading(true);

      const response = await api.get(
        `${UrlsEnum.CATEGORIES}?companyId=${selectedCompany?.id}`
      );

      setCategories(response.data);
      setFilteredArray(response.data);
    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar as Categorias";
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
      ? categories.filter((item) =>
          item.description.toLowerCase().includes(lowerCaseSearch)
        )
      : categories;

    setFilteredArray(filtered);
  };

  function handleEdit(categoriaPet: CategoryPet) {
    route.push(`/categories/${categoriaPet.id}?action=edit`);
  }
  function handleDelete(categoriaPet: CategoryPet) {
    route.push(`/categories/${categoriaPet.id}?action=delete`);
  }
  function handleView(categoriaPet: CategoryPet) {
    route.push(`/categories/${categoriaPet.id}?action=view`);
  }
  function handleAdd() {
    route.push(`/categories/0?action=add`);
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <HeaderContent
          title="Categorias"
          searchPlaceholder="Pesquisar Categoria"
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
