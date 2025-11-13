import { api } from "@services/api";
import { EmployeeDTO } from "@dtos/EmployeeDTO";
import { AppError } from "@utils/AppError";
import { toastPS } from "@components/Toast";

export const handleEdit = async (
  id: string,
  data: EmployeeDTO,
  setEmployeeData: Function,
  setIsLoading: Function
) => {
  try {
    setIsLoading(true);
    const response = await api.put(`users/${id}`, data);
    setEmployeeData(response.data as EmployeeDTO);
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
    const response = await api.delete(`companies/${id}`);
    setCompanyData(response.data as EmployeeDTO);
    toastPS("Exclusão realizada com sucesso", "success");
  } catch (error: any) {
    handleError(error);
  } finally {
    setIsLoading(false);
  }
};

export const handleAdd = async (
  data: EmployeeDTO,
  setCompanyData: Function,
  setIsLoading: Function
) => {
  let active = data.active as string;
  const addEmployeeData = {
    ...data,
    active: active.toLowerCase() === "true",
    address: {
      ...data.address,
      lat: -23.684989159899636,
      lon: -46.53484196947442,
    },
  };

  try {
    setIsLoading(true);
    const response = await api.post(`/users`, addEmployeeData);
    setCompanyData(response.data as EmployeeDTO);
    toastPS("Funcionário adicionado com sucesso", "success");
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
