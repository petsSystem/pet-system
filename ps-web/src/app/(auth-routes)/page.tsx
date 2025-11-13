"use client";
import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Image from "next/image";

// import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { yupResolver } from "@hookform/resolvers/yup";
import validationSchema from "./validationSchema";

import Link from "next/link";
import { InputPS, ButtonPS } from "@components/index";
import { useAuth } from "@hooks/useAuth";
import { useApp } from "@hooks/useApp";
import { AppError } from "@utils/AppError";
import { toastPS } from "@components/Toast";
import { removeSpecialChars } from "@utils/chars";

// import HeroSVG from "/hero.svg";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useApp();
  const router = useRouter();
  const { signIn, isAuthenticated } = useAuth();

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
    password: string;
  };

  async function handleSignIn({ cpf, password }: FormData) {
    try {
      setIsLoading(true);
      const auxCPF = removeSpecialChars(cpf);
      await signIn(auxCPF, password);
    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error?.message
        : "Não foi possível entrar. Tente novamente mais tarde";
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
            {/* <p className="2xl:px-20 mb-5">
              Pet Shop: Organize, agende e simplifique a administração do seu
              negócio.
            </p> */}

            <span className="mt-15 inline-block">
              <Image src="/logo.png" alt="Hero" width={250} height={250} />
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
              Logar no PetAdmin
            </h2>

            <form onSubmit={handleSubmit(handleSignIn)}>
              <div>
                <InputPS
                  label="CPF"
                  id="cpf"
                  type="cpf"
                  register={register}
                  errors={errors}
                  mask="999.999.999-99"
                  placeholder="Digite seu CPF"
                />
              </div>
              <div>
                <InputPS
                  label="Senha"
                  id="password"
                  register={register}
                  errors={errors}
                  type="password"
                  placeholder="Digite sua senha"
                />
              </div>

              <div className="mb-5">
                <ButtonPS type="submit" loading={isLoading}>
                  Entrar
                </ButtonPS>
              </div>

              <div className="mt-6 text-center">
                <p>
                  <Link
                    className="flex flex-col justify-center items-center text-primary-500 h-20 w-20 w-full "
                    href="/reset-password"
                  >
                    Esqueci minha senha
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
