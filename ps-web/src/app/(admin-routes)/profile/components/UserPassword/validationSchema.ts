import * as yup from "yup";

export const validationSchema = yup.object().shape({
  oldPassword: yup.string().required("A senha atual é obrigatória"),
  newPassword: yup
    .string()
    .required("A nova senha é obrigatória")
    .min(5, "A senha nova deve conter pelo menos 5 caracteres"),
  confirmNewPassword: yup
    .string()
    .required("A confirmação da nova senha é obrigatória")
    .oneOf([yup.ref("newPassword")], "As senhas não coincidem"),
});
