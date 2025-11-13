interface Endereco {
  postalCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
}

export interface UserProfileDTO {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: Endereco;
}
