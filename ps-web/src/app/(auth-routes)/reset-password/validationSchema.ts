import * as yup from "yup";

const validationSchema = yup.object().shape({
  cpf: yup.string().required("O CPF é obrigatório"),
});

export default validationSchema;
