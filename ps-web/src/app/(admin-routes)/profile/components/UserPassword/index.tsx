"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

import { useRouter } from "next/navigation";

import { LayoutPS } from "@components/template/Layout";
import { Avatar, Banner, Input } from "@/src/components";

import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./validationSchema";

import { InputPS, ButtonPS } from "@components/index";
import { useAuth } from "@hooks/useAuth";
import { toastPS } from "@components/Toast";
import { AppError } from "@utils/AppError";

interface Props {
  setIsOpen: (value: boolean) => void;
}

export default function UserPassword({ setIsOpen }: Props) {
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
      setIsOpen(false);
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
          <Input
            id="oldPassword"
            label="Senha atual:"
            register={register}
            placeholder="Digite a senha atual"
            errors={errors.oldPassword?.message}
          />
          <Input
            id="newPassword"
            label="Nova Senha:"
            register={register}
            placeholder="Digite a nova senha"
            errors={errors.newPassword?.message}
          />

          <Input
            id="confirmNewPassword"
            label="Confirmar Nova Senha:"
            register={register}
            placeholder="confirmação da nova senha"
            errors={errors.confirmNewPassword?.message}
          />
        </div>
        <div className="p-5 flex justify-end ">
          <div className="w-full">
            <button className="btn bg-primary-500 hover:bg-primary-600 text-white w-full">
              Atualizar senha
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
