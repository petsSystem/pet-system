import { z } from "zod";

// Definindo o esquema de validação
export const validationSchema = z.object({
  productIds: z.array(z.any()),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  days: z.array(z.any()),
});
