"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

import { useRouter } from "next/navigation";

import { yupResolver } from "@hookform/resolvers/yup";
import validationSchema from "./validationSchema";

import Link from "next/link";
import { InputPS, ButtonPS } from "@components/index";
import { useAuth } from "@hooks/useAuth";
import { useApp } from "@hooks/useApp";
import { AppError } from "@utils/AppError";
import { toastPS } from "@components/Toast";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useApp();
  const router = useRouter();
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
    cpf: string;
  };

  async function handleResetPassword({ cpf }: FormData) {
    try {
      setIsLoading(true);
      await forgotPassword(cpf);
    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error?.message
        : "Não foi possível enviar o link. Tente novamente mais tarde";
      toastPS(title, "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-full w-full px-2 rounded-sm bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center  min-h-screen min-w-screen-2xl">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="py-17.5 px-26 text-center">
            <span className="mt-15 inline-block">
              <Image
                src="/forgot_password.jpeg"
                alt="Hero"
                width={250}
                height={250}
              />
            </span>
          </div>
        </div>

        <div className="w-full border-stroke lg:px-16 dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <span className="2xl:px-20 mb-5 flex justify-center">
            <Image
              src="/paw.svg"
              alt="Pata"
              width={80}
              height={80}
              className="border rounded-full border-primary-200"
            />
          </span>
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="flex justify-center mb-9 text-2xl font-bold text-gray-700 dark:text-white sm:text-title-xl2">
              Altere sua senha
            </h2>

            <form onSubmit={handleSubmit(handleResetPassword)}>
              <div>
                <InputPS
                  label="CPF"
                  id="cpf"
                  register={register}
                  errors={errors}
                  mask="999.999.999-99"
                  placeholder="Digite seu CPF"
                />
              </div>

              <div className="mb-5">
                <ButtonPS type="submit" loading={isLoading}>
                  Enviar
                </ButtonPS>
              </div>

              <div className="mt-6 text-center">
                <p>
                  Já tem conta ?{" "}
                  <Link
                    className="flex flex-col justify-center items-center text-primary-500 h-20 w-20 w-full "
                    href="/"
                  >
                    Voltar para o login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
