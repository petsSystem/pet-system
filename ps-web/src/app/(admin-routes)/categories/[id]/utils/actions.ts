import { api } from "@services/api";
import { CompanyDTO } from "@dtos/CompanyDTO";
import { AppError } from "@utils/AppError";
import { toastPS } from "@components/Toast";
import { CategoryDTO } from "@/src/dtos";

export const handleEdit = async (
  id: string,
  data: CategoryDTO,
  setCompanyData: Function,
  setIsLoading: Function,
  updateCompany: Function
) => {
  try {
    setIsLoading(true);
    const response = await api.put(`categories/${id}`, data);
    setCompanyData(response.data as CompanyDTO);
    updateCompany(response.data);
    toastPS("Alteração realizada com sucesso", "success");
  } catch (error: any) {
    handleError(error);
  } finally {
    setIsLoading(false);
  }
};

export const handleDelete = async (
  id: string,
  setCompanyData: Function,
  setIsLoading: Function
) => {
  try {
    setIsLoading(true);
    const response = await api.delete(`categories/${id}`);
    setCompanyData(response.data as CompanyDTO);
    toastPS("Exclusão realizada com sucesso", "success");
  } catch (error: any) {
    handleError(error);
  } finally {
    setIsLoading(false);
  }
};

export const handleAdd = async (
  data: CategoryDTO,
  setCategoryData: Function,
  setIsLoading: Function
) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/categories`, data);
    setCategoryData(response.data as CompanyDTO);
    toastPS("Categoria adicionada com sucesso", "success");
  } catch (error: any) {
    handleError(error);
  } finally {
    setIsLoading(false); //37433cea-9627-4fb3-a923-99bb17a29610
    //e4be4387-6c53-45d0-915f-b9ee453e5f22
  }
};

const handleError = (error: any) => {
  const isAppError = error instanceof AppError;
  const title = isAppError
    ? error?.message
    : "Não foi possível atualizar os dados. Tente novamente mais tarde";
  toastPS(title);
};
