import { api } from "@services/api";
import { CompanyDTO } from "@dtos/CompanyDTO";
import { AppError } from "@utils/AppError";
import { toastPS } from "@components/Toast";
import { UrlsEnum } from "@/src/enums";

export const handleEdit = async (
  id: string,
  data: CompanyDTO,
  setCompanyData: Function,
  setIsLoading: Function,
  updateCompany: Function
) => {
  try {
    setIsLoading(true);
    const response = await api.put(`${UrlsEnum.COMPANIES}/${id}`, data);
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
    const response = await api.delete(`${UrlsEnum.COMPANIES}/${id}`);
    setCompanyData(response.data as CompanyDTO);
    toastPS("Exclusão realizada com sucesso", "success");
  } catch (error: any) {
    handleError(error);
  } finally {
    setIsLoading(false);
  }
};

export const handleAdd = async (
  data: CompanyDTO,
  setCompanyData: Function,
  setIsLoading: Function
) => {
  let active = data.active as string;
  const addCompanyData = {
    ...data,
    active: false,
    address: {
      ...data.address,
      lat: -23.684989159899636,
      lon: -46.53484196947442,
    },
  };

  try {
    setIsLoading(true);
    const response = await api.post(UrlsEnum.COMPANIES, addCompanyData);
    setCompanyData(response.data as CompanyDTO);
    toastPS("Petshop adicionado com sucesso", "success");
  } catch (error: any) {
    handleError(error);
  } finally {
    setIsLoading(false);
  }
};

const handleError = (error: any) => {
  const isAppError = error instanceof AppError;
  const title = isAppError
    ? error?.message
    : "Não foi possível atualizar os dados. Tente novamente mais tarde";
  toastPS(title);
};
