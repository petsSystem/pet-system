"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { LayoutPS } from "@components/template/Layout";
import { AppError } from "@utils/AppError";

import { GenericForm } from "@components/GenericForm";

import { validationSchema } from "./utils/validationSchema";
import { api } from "@services/api";

import { generalFields } from "./utils/formFields";
import ModalBasic from "@components/modal-basic";

import { UserDTO } from "@dtos/UserDTO";
import Modal from "@components/Modal";
import UserPassword from "./components/UserPassword";

const PageDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const route = useRouter();

  const actionParam: string | null = searchParams.get("action");

  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserDTO | null>(null);

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function getData() {
      try {
        const response = await api.get<any>(`/users/profile`);
        setUserData(response.data);
      } catch (error: any) {
        const isAppError = error instanceof AppError;
        const title = isAppError
          ? error?.message
          : "Não foi possível entrar. Tente novamente mais tarde";
      }
    }
    getData();
  }, []);

  const handleSubmit = async (data: any) => {
    // try {
    //   const response = await api.put<any>(`/users/profile`, data);
    //   setUserData(response.data);
    // } catch (error: any) {
    //   const isAppError = error instanceof AppError;
    //   const title = isAppError
    //     ? error?.message
    //     : "Não foi possível atualizar as informações. Tente novamente mais tarde";
    // }
  };

  return (
    <>
      {userData ? (
        <GenericForm
          id="general"
          formFields={generalFields}
          defaultValues={actionParam === "add" ? "" : userData}
          onSubmit={handleSubmit}
          action={actionParam}
          isLoading={isLoading}
          validationSchema={validationSchema}
          labelButton={"Atualizar"}
          secondaryAction={{
            onChange: () => setModalOpen(!modalOpen),
            onClick: () => setModalOpen(!modalOpen),
            label: "Alterar senha",
            checked: true,
            color: "green",
            type: "button",
          }}
        />
      ) : null}

      <ModalBasic
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        title="Alteração de senha:"
      >
        <div className="w-full justify-center p-8">
          <UserPassword />
        </div>
      </ModalBasic>
    </>

    // <Modal isOpen={modalOpen} setIsOpen={setModalOpen}>
    //   {/* Conteúdo do Modal de sucesso */}
    // </Modal>
  );
};

export default PageDetails;
