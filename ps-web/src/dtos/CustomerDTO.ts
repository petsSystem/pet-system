export interface CustomerDTO {
  id?: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
  origin?: "SYS" | "APP";
  appStatus?: "PENDING" | "INACTIVE" | "ACTIVE";
  active?: boolean;
  companyIds?: string[];
  address: {
    postalCode: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    lat: number;
    lon: number;
  };
  username: string;
  changePassword: boolean;
  role: "USER" | "ADMIN" | "MANAGER";
}
