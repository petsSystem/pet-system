"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useProfile } from "@hooks/useProfile";
import { useCompany } from "@hooks/useCompany";
import { fetchProducts } from "@services/products-service";
import { TableColumn } from "@components/ps-table";
import { checkPermission } from "@utils/checkPermission";

import HeaderContent from "@components/ps-header-content";
import Table from "@components/ps-table";

import { ResourcesEnum, ActionsEnum } from "@enums/index";
import { ProductDTO } from "@dtos/index";

const columns: TableColumn<any>[] = [
  { key: "categoryLabel", title: "Categoria" },
  {
    key: "additional",
    title: "Tipo",
    type: "boolean",
    booleanDisplay: { true: "Adicional", false: "Princial" },
  },
  { key: "name", title: "Descrição" },
  { key: "amount", title: "Valor", type: "currency" },
  { key: "active", title: "Status", color: true, type: "status" },
];

export default function Services() {
  const [isLoading, setIsLoading] = useState(false);
  const [filteredArray, setFilteredArray] = useState<ProductDTO[]>([]);
  const [data, setData] = useState<ProductDTO[]>([]);

  const router = useRouter();
  const { profile } = useProfile();
  const { findSelectedCompanyById } = useCompany();
  const selectedCompany = findSelectedCompanyById(profile?.companyId);

  async function fetchData() {
    try {
      setIsLoading(true);
      const productsData = await fetchProducts({
        companyId: selectedCompany?.id,
      });
      setData(productsData);
      setFilteredArray(productsData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (searchValue: string) => {
    const lowerCaseSearch = searchValue.toLowerCase();

    const filtered = !!searchValue?.length
      ? data.filter((item) => item.name.toLowerCase().includes(lowerCaseSearch))
      : data;

    setFilteredArray(filtered);
  };

  const handleEdit = (product: ProductDTO) => {
    router.push(`/services/${product.id}?action=edit`);
  };

  const handleDelete = (product: ProductDTO) => {
    router.push(`/services/${product.id}?action=delete`);
  };

  const handleView = (product: ProductDTO) => {
    router.push(`/services/${product.id}?action=view`);
  };

  const handleAdd = () => {
    router.push(`/services/0?action=add`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      <HeaderContent
        title="Serviços"
        searchPlaceholder="Pesquisar Serviços"
        buttonLabel="Novo Serviço"
        onButtonClick={handleAdd}
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
  );
}
