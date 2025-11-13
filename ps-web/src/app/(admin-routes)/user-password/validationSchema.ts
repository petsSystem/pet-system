import * as yup from "yup";

export const validationSchema = yup.object().shape({
  oldPassword: yup.string().required("A senha atual é obrigatória"),
  newPassword: yup.string().required("A nova senha é obrigatória"),
  confirmNewPassword: yup
    .string()
    .required("A confirmação da nova senha obrigatória"),
});
