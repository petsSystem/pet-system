import { UserAddressDTO } from "./UserAdressDTO";

export type UserDTO = {
  id?: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  accessToken?: string;
  token?: string;
  emailValidated?: boolean;
  active?: boolean | string;
  companyIds: string[];
  profileIds: string[];
  productIds: string[];
  address: UserAddressDTO;
};
