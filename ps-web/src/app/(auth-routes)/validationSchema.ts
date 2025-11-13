import * as yup from "yup";

const validationSchema = yup.object().shape({
  cpf: yup.string().required("O CPF é obrigatório"),
  password: yup.string().required("A senha é obrigatória"),
});

export default validationSchema;
