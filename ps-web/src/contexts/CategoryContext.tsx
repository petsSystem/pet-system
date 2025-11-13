"use client";
import { api } from "@services/api";
import { createContext, ReactNode, useState } from "react";
import { useProfile } from "@hooks/useProfile";
import { UrlsEnum } from "../enums";
import { CategoryDTO } from "../dtos";

interface CategoryContextProps {
  getCategories: () => Promise<any>;
  setSelectedCategoryLocally: (id: string) => void;
  findSelectedCategoryById: (
    categoryId: string | undefined
  ) => CategoryDTO | undefined;
  categories: CategoryDTO[] | null | undefined;
  selectedCategory: CategoryDTO | undefined;
  updateCategory: (company: CategoryDTO) => void;
}

export const CategoryContext = createContext<CategoryContextProps>(
  {} as CategoryContextProps
);

export const CategoryProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryDTO[]>(
    [] as CategoryDTO[]
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryDTO>();

  const { profile } = useProfile();

  async function getCategories() {
    try {
      const { data } = await api.get(
        `${UrlsEnum.CATEGORIES}?companyId=${profile?.companyId}`
      );
      const categoriesData = data.content;

      if (categoriesData.length > 0) {
        setCategories(categoriesData);
      }
    } catch (error) {
      throw error;
    }
  }

  const findCategoryById = (
    categoryId: string,
    categories: CategoryDTO[]
  ): CategoryDTO | undefined => {
    return categories.find((category) => category.id === categoryId);
  };

  const findSelectedCategoryById = (
    categoryId: string | undefined
  ): CategoryDTO | undefined => {
    return categories.find((category) => category.id === categoryId);
  };

  function setSelectedCategoryLocally(id: string) {
    const foundCategory = findCategoryById(id, categories);
    setSelectedCategory(foundCategory);
  }

  const updateCategory = (updatedCategory: CategoryDTO) => {
    const updatedCategories = categories.map((category) =>
      category.id === updatedCategory.id ? updatedCategory : category
    );
    setCategories(updatedCategories);

    if (selectedCategory?.id === updatedCategory.id) {
      setSelectedCategory(updatedCategory);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories: categories,
        getCategories: getCategories,
        setSelectedCategoryLocally: setSelectedCategoryLocally,
        selectedCategory: selectedCategory,
        updateCategory: updateCategory,
        findSelectedCategoryById: findSelectedCategoryById,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
