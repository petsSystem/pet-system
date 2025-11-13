export interface AdditionalProductResponse {
  name: string;
  amount: number;
  id: string;
}

export interface ProductDTO {
  id: string;
  companyId: string;
  categoryId: string;
  name: string;
  amount: number;
  additional: boolean;
  additionalIds: string[];
  active: boolean;
  intervalMinutes: number;
  additionals: AdditionalProductResponse[];
}
