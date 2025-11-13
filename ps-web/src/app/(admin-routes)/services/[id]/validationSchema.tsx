import { z, ZodError } from "zod";

export const validationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatorio"),
  amount: z.string().min(1, "Valor é obrigatório"),
  intervalMinutes: z.string().min(1, "Duração é obrigatório"),
  categoryId: z.string().min(1, "Categoria é Obrigatoria"),
  additional: z.any(),
  additionalIds: z.any(),
});

// {
//   "categoryId": "",
//   "name": "",
//   "amount": "0,00",
//   "intervalMinutes": "",
//   "additional": ""
// }
