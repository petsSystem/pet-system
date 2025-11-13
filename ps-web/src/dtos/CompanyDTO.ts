import { CompanyAddressDTO } from "./CompanyAddressDTO";

export type CompanyDTO = {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  address?: CompanyAddressDTO;
  active: boolean | string;
  createdAt?: string;
};
