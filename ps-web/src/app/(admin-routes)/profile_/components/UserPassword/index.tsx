"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

import { useRouter } from "next/navigation";

import { LayoutPS } from "@components/template/Layout";

import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./validationSchema";

import { InputPS, ButtonPS } from "@components/index";
import { useAuth } from "@hooks/useAuth";
import { toastPS } from "@components/Toast";
import { AppError } from "@utils/AppError";

export default function UserPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const { alterPassword } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  type FormData = {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  };

  async function handleResetPassword({
    oldPassword,
    newPassword,
    confirmNewPassword,
  }: FormData) {
    try {
      setIsLoading(true);
      await alterPassword({ oldPassword, newPassword });
      toastPS("Senha alterada com sucesso", "success");
    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error?.message
        : "Não foi possível alterar a senha. Tente novamente mais tarde";
      toastPS(title, "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(handleResetPassword)}>
        <div>
          <InputPS
            label="Senha atual"
            id="oldPassword"
            type="password"
            register={register}
            errors={errors}
          />
          <InputPS
            label="Nova Senha"
            id="newPassword"
            type="password"
            register={register}
            errors={errors}
          />
          <InputPS
            label="Confirmar Nova Senha"
            id="confirmNewPassword"
            type="password"
            register={register}
            errors={errors}
          />
        </div>
        <div className="p-5 flex justify-end space-x-2">
          <div className="w-full">
            <ButtonPS type="submit" loading={isLoading}>
              Alterar senha
            </ButtonPS>
          </div>
        </div>

        {/* <div className="mb-5">
 
        </div> */}
      </form>
    </div>
  );
}
