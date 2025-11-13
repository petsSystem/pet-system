export type EmployeeDTO = {
  id: string;
  type: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: {
    postalCode: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
  };
  active: boolean | string;
  companyIds: string[];
  createdAt: string;
};
