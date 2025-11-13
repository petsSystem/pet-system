// pages/CompanyDetails.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { useCompany } from "@hooks/useCompany";
import { handleEdit, handleDelete } from "./utils/actions";
import { Loading } from "@components/Loading";
import CategoryForm from "./components/Form";
import { CategoryDTO } from "@/src/dtos";
import { UrlsEnum } from "@/src/enums";

type Params = {
  id: string;
};

const CategoryDetails: React.FC = () => {
  const params: Params = useParams();
  const searchParams = useSearchParams();
  const route = useRouter();
  const { updateCompany } = useCompany();

  const { id } = params;
  const actionParam: string | null = searchParams.get("action");

  const [isLoading, setIsLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<CategoryDTO | undefined>(
    undefined
  );

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await api.get<any>(`categories/${id}`);
        const { data: category } = response;
        setCategoryData(category);
      } catch (error: any) {
        const errorMessage =
          error instanceof AppError
            ? error.message
            : "Não foi possível obter os detalhes da Categoria. Tente novamente mais tarde.";
        console.error(errorMessage);
      }
    }

    getCategories();
  }, [id]);

  const handleAction = async (data: CategoryDTO) => {
    if (actionParam === "edit") {
      await handleEdit(id, data, setCategoryData, setIsLoading, updateCompany);
      route.replace(`/categories`);
    } else if (actionParam === "delete") {
      await handleDelete(id, setCategoryData, setIsLoading);
      route.replace(`/categories`);
    } else if (actionParam === "add") {
      // await handleAdd(data, setCategoryData, setIsLoading);
    }
  };

  function handleAdd() {
    // route.push(`/categories/0?action=add`);
  }

  const handleSwitchChange = async (isActive: boolean) => {
    try {
      setIsLoading(true);
      const response = await api.patch<any>(`${UrlsEnum.CATEGORIES}/${id}`, [
        {
          op: "replace",
          path: "/active",
          value: isActive,
        },
      ]);
      setCategoryData(response.data);
    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error?.message
        : "Não foi possível entrar. Tente novamente mais tarde";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {categoryData && (
        <CategoryForm
          onSubmit={handleAction}
          data={categoryData}
          isView={actionParam === "view"}
          switchChange={handleSwitchChange}
        />
      )}
      {isLoading && <Loading />}
    </>
  );
};

export default CategoryDetails;
