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

export default function UserPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();

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
    //TODO
    console.log(oldPassword, newPassword, confirmNewPassword);
    // try {
    //   setIsLoading(true);
    //   await forgotPassword(email);
    // } catch (error: any) {
    //   const isAppError = error instanceof AppError;
    //   const title = isAppError
    //     ? error?.message
    //     : "Não foi possível enviar o link. Tente novamente mais tarde";
    //   toastPS(title, "error");
    // } finally {
    //   setIsLoading(false);
    // }
  }

  return (
    <LayoutPS
      title="Usuários"
      subTitle="Configuração e ajustes do Petshop"
      menu="Profile"
    >
      <div className="w-full lg:px-16  xl:w-2/3 xl:border-l-2 bg-red-100">
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <h2 className="flex justify-center mb-9 text-2xl font-bold text-gray-700 dark:text-white sm:text-title-xl2">
            Alteração de senha
          </h2>

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

            <div className="mb-5">
              <ButtonPS type="submit" loading={isLoading}>
                Alterar senha
              </ButtonPS>
            </div>
          </form>
        </div>
      </div>
    </LayoutPS>
  );
}
