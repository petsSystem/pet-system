import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { UrlsEnum } from "@enums/index";
import { UserDTO } from "@dtos/index";

interface ProductServiceResponse {
  content: UserDTO[];
}

interface ServiceProps {
  companyId: string | undefined;
  productId: string | undefined;
}

function buildUrl(companyId: string | undefined, productId?: string): string {
  let url = `${UrlsEnum.USERS}?companyId=${companyId}`;
  if (productId !== undefined) {
    url += `&productId=${productId}`;
  }
  return url;
}

export async function fetchUsers({
  companyId,
  productId,
}: ServiceProps): Promise<UserDTO[]> {
  try {
    const response = await api.get<ProductServiceResponse>(
      buildUrl(companyId, productId)
    );
    return response.data.content;
  } catch (error: any) {
    throw new AppError("Não foi possível carregar os Dados");
  }
}
