import { z, ZodError } from "zod";

const addressSchema = z.object({
  postalCode: z.string().min(9, "O CEP inválido"),
  street: z.string().min(1, "A rua é obrigatória"),
  number: z.string().min(1, "O número é obrigatório"),
  neighborhood: z.string().min(1, "O bairro é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  state: z.string().min(1, "O estado é obrigatório"),
  country: z.string().min(1, "O país é obrigatório"),
});

export const validationSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z
    .string()
    .min(1, "O email é obrigatório")
    .email("Formato do email inválido"),
  phone: z.string().min(11, "O telefone inválido"),
  address: addressSchema,
});
