import { z, ZodError } from "zod";

export const validationSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  color: z.string().min(1, "A cor do pelo é obrigatório"),
  gender: z.string().min(1, "Selecione o gênero"),
  specie: z.string().min(1, "A espécie é obrigatória"),
  birthDate: z.string().min(1, "A data de nascimento é obrigatória"),
  temper: z.string().min(1, "O temperamento é obrigatório"),
  coat: z.string().min(1, "O tipo de pelagem é obrigatório"),
  breed: z.string().min(1, "A raça é obrigatória"),
  size: z.string().min(1, "Selecione o porte"),
  weight: z.string().min(0, "O peso deve ser maior ou igual a zero"),
  neutered: z.any(),
});
