import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { UrlsEnum } from "@enums/index";
import { ProductDTO } from "@dtos/index";

interface ProductServiceResponse {
  content: ProductDTO[];
}

interface ServiceProps {
  companyId: string | undefined;
  categoryId?: string;
  additional?: boolean;
}

function buildUrl(
  companyId: string | undefined,
  categoryId?: string,
  additional?: boolean
): string {
  let url = `${UrlsEnum.PRODUCTS}?companyId=${companyId}`;
  if (additional !== undefined) {
    url += `&additional=${additional}`;
  }
  if (categoryId !== undefined) {
    url += `&categoryId=${categoryId}`;
  }
  return url;
}

export async function fetchProducts({
  companyId,
  additional,
  categoryId,
}: ServiceProps): Promise<ProductDTO[]> {
  try {
    const response = await api.get<ProductServiceResponse>(
      buildUrl(companyId, categoryId, additional)
    );
    return response.data.content;
  } catch (error: any) {
    throw new AppError("Não foi possível carregar os Dados");
  }
}
