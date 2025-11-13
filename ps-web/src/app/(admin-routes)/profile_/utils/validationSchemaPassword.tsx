import * as yup from "yup";

export const validationSchemaPassword = yup.object().shape({
  email: yup.string().required("O e-mail é obrigatório"),
});
