import * as yup from "yup";

export const validationSchema = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  cnpj: yup
    .string()
    .required("O CNPJ é obrigatório")
    .min(18, "CNPJ  formato inválido "),
  phone: yup
    .string()
    .required("O telefone é obrigatório")
    .min(15, "Telefone formato inválido"),
  postalCode: yup
    .string()
    .required("O CEP é obrigatório")
    .min(9, "Formato inválido"),
  street: yup.string().required("O CEP é obrigatório"),
  number: yup.string().required("Número é obrigatório"),
  neighborhood: yup.string().required("O Bairro é obrigatório"),
  city: yup.string().required("A Cidade é obrigatório"),
  state: yup.string().required("O Estado é obrigatório"),
  country: yup.string().required("O País é obrigatório"),
});
