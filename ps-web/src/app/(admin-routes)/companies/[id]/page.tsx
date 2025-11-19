"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

import { AppError } from "@utils/AppError";
import { useProfile } from "@hooks/useProfile";

import { api } from "@services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { getActionLabel } from "@utils/getActionLabel";
import { Input } from "@/src/components";
import { useForm, SubmitHandler } from "react-hook-form";
import { toastPS } from "@/src/components/Toast";
import { ActionsEnum, ResourcesEnum, UrlsEnum } from "@/src/enums";
import IconButton from "@/src/components/button-ps";
import { extractNumbers } from "@utils/chars";
import { CompanyDTO } from "@/src/dtos/CompanyDTO";
import { useApp } from "@/src/hooks/useApp";
import { checkPermission } from "@/src/utils/checkPermission";
import Select from "@/src/components/select-ps";

type Params = {
  id: string;
};

interface FormInputs {
  name: string;
  cnpj: string;
  phone: string;
  address: {
    postalCode: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    lat: number;
    lon: number;
  };
  active: boolean;
  ownerName?: string;
  ownerCpf?: string;
  ownerEmail?: string;
  ownerPhone?: string;
}

const CompanyForm = () => {
  const params: Params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { profile } = useProfile();
  const { isLoading, setIsLoading } = useApp();

  const { id: idParam } = params;
  const actionParam: string | null = searchParams.get("action");
  const isAdd = actionParam === "add";
  const isEdit = actionParam === "edit";
  const isView = actionParam === "view";
  
  const labelButton = getActionLabel(isAdd ? "add" : "edit");

  const [companyData, setCompanyData] = useState<CompanyDTO | null>(null);
  const [ownerData, setOwnerData] = useState<any>(null);
  const [owners, setOwners] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);

  const permission = checkPermission({
    resource: ResourcesEnum.COMPANY,
    action: isAdd ? ActionsEnum.CREATE : ActionsEnum.EDIT,
    permissions: profile?.permissions,
  });

  const canEdit = (isAdd || isEdit) && permission;

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Buscar dados da empresa
        const companyResponse = await api.get<CompanyDTO>(`${UrlsEnum.COMPANIES}/${idParam}`);
        setCompanyData(companyResponse.data);
        
        // Buscar perfis
        const profilesResponse = await api.get(`${UrlsEnum.PROFILES}`);
        setProfiles(profilesResponse.data.content);
        
        // Buscar usuários da empresa
        try {
          const usersResponse = await api.get(`${UrlsEnum.USERS}?companyId=${idParam}`);
          console.log('=== RESPOSTA USUARIOS ===', usersResponse.data);
          
          // Assumir que todos os usuários retornados são proprietários por enquanto
          const allUsers = usersResponse.data?.content || [];
          console.log('=== USUARIOS ENCONTRADOS ===', allUsers);
          
          setOwners(allUsers);
          setOwnerData(allUsers.length > 0 ? allUsers[0] : null);
        } catch (error) {
          console.error('Erro ao buscar usuários da empresa:', error);
          setOwners([]);
          setOwnerData(null);
        }
        
      } catch (error: any) {
        console.error("Erro ao buscar dados da empresa:", error);
        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : "Erro ao carregar empresa";
        toastPS(title, "error");
      } finally {
        setIsLoading(false);
      }
    }

    if (idParam !== "0") {
      fetchData();
    } else {
      // Para nova empresa, buscar apenas perfis
      async function fetchProfiles() {
        try {
          const profilesResponse = await api.get(`${UrlsEnum.PROFILES}`);
          setProfiles(profilesResponse.data.content);
        } catch (error) {
          console.error("Erro ao buscar perfis:", error);
        }
      }
      fetchProfiles();
    }
  }, [idParam]);

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    const companyPayload = {
      name: data.name,
      cnpj: extractNumbers(data.cnpj),
      phone: extractNumbers(data.phone),
      address: {
        ...data.address,
        postalCode: extractNumbers(data.address.postalCode),
        number: extractNumbers(data.address.number),
        lat: -23.684989159899636,
        lon: -46.53484196947442,
      },
      active: true,
    };

    try {
      setIsLoading(true);
      
      let companyId = idParam;
      
      // Salvar empresa
      if (isAdd) {
        const companyResponse = await api.post(UrlsEnum.COMPANIES, companyPayload);
        companyId = companyResponse.data.id;
        toastPS("Empresa criada com sucesso", "success");
      } else {
        await api.put(`${UrlsEnum.COMPANIES}/${idParam}`, companyPayload);
        toastPS("Empresa atualizada com sucesso", "success");
      }
      
      // Criar/atualizar proprietário se dados foram preenchidos
      if (data.ownerName && data.ownerCpf && data.ownerEmail) {
        const ownerProfile = profiles.find(p => p.role === 'OWNER');
        
        if (ownerProfile) {
          const ownerPayload = {
            name: data.ownerName,
            cpf: extractNumbers(data.ownerCpf),
            email: data.ownerEmail,
            phone: data.ownerPhone ? extractNumbers(data.ownerPhone) : '',
            password: '123456',
            profileIds: [ownerProfile.id],
            companyIds: [companyId],
            address: {
              postalCode: '00000000',
              street: 'Não informado',
              number: '0',
              neighborhood: 'Não informado',
              city: 'Não informado',
              state: 'Não informado',
              country: 'Brasil',
              lat: -23.684989159899636,
              lon: -46.53484196947442,
            },
          };
          
          if (ownerData) {
            // Atualizar proprietário existente
            await api.put(`${UrlsEnum.USERS}/${ownerData.id}`, ownerPayload);
            toastPS("Proprietário atualizado com sucesso", "success");
          } else {
            // Criar novo proprietário
            await api.post(UrlsEnum.USERS, ownerPayload);
            toastPS("Proprietário criado com sucesso! Senha: 123456", "success");
          }
        }
      }
      
      router.push("/companies");
    } catch (errors: any) {
      console.log("error", errors);
      toastPS(errors.message || "Erro ao salvar empresa", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-white-100 h-full">
      {(companyData || isAdd) && (
        <div className="px-4 sm:px-6 lg:px-4 py-2 w-full max-w-[96rem] mx-auto">
          <div className="space-y-8">
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl text-slate-500 font-bold mb-4">
                    {isAdd ? "Nova Empresa" : "Dados da Empresa"}
                  </h2>
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  <Input
                    label="Nome:"
                    id="name"
                    defaultValue={companyData?.name ?? ""}
                    register={register}
                    placeholder="Digite o nome da empresa"
                    errors={errors.name?.message}
                    disabled={!canEdit}
                  />
                  <Input
                    label="CNPJ:"
                    id="cnpj"
                    defaultValue={companyData?.cnpj ?? ""}
                    placeholder="Digite o CNPJ"
                    register={register}
                    errors={errors.cnpj?.message}
                    disabled={!canEdit}
                    mask="99.999.999/9999-99"
                  />
                  <Input
                    label="Telefone:"
                    id="phone"
                    defaultValue={companyData?.phone ?? ""}
                    placeholder="Digite o telefone"
                    register={register}
                    errors={errors.phone?.message}
                    disabled={!canEdit}
                    mask="(99)99999-9999"
                  />
                </div>

                <h2 className="text-2xl text-slate-500 font-bold mb-4 mt-6">
                  Endereço
                </h2>
                <div className="grid gap-2 md:grid-cols-3">
                  <Input
                    label="CEP:"
                    id="address.postalCode"
                    defaultValue={companyData?.address?.postalCode ?? ""}
                    placeholder="Digite o CEP"
                    register={register}
                    errors={errors.address?.postalCode?.message}
                    disabled={!canEdit}
                    mask="99999-999"
                  />
                  <Input
                    label="Rua:"
                    id="address.street"
                    defaultValue={companyData?.address?.street ?? ""}
                    placeholder="Nome da rua"
                    register={register}
                    errors={errors.address?.street?.message}
                    disabled={!canEdit}
                  />
                  <Input
                    label="Número:"
                    id="address.number"
                    defaultValue={companyData?.address?.number ?? ""}
                    placeholder="Digite o número"
                    register={register}
                    errors={errors.address?.number?.message}
                    disabled={!canEdit}
                    mask="99999"
                  />
                  <Input
                    label="Bairro:"
                    id="address.neighborhood"
                    defaultValue={companyData?.address?.neighborhood ?? ""}
                    placeholder="Digite o bairro"
                    register={register}
                    errors={errors.address?.neighborhood?.message}
                    disabled={!canEdit}
                  />
                  <Input
                    label="Cidade:"
                    id="address.city"
                    defaultValue={companyData?.address?.city ?? ""}
                    placeholder="Digite a cidade"
                    register={register}
                    errors={errors.address?.city?.message}
                    disabled={!canEdit}
                  />
                  <Input
                    label="Estado:"
                    id="address.state"
                    defaultValue={companyData?.address?.state ?? ""}
                    placeholder="Digite o estado"
                    register={register}
                    errors={errors.address?.state?.message}
                    disabled={!canEdit}
                  />
                  <Select
                    id="address.country"
                    label="País:"
                    register={register}
                    value="Brasil"
                    options={[{ label: "Brasil", value: "Brasil" }]}
                    errors={errors.address?.country?.message}
                    disabled={!canEdit}
                  />
                </div>

                <div className="flex justify-between items-center mb-4 mt-6">
                  <h2 className="text-2xl text-slate-500 font-bold">
                    Proprietários ({owners.length})
                  </h2>
                </div>
                
                {owners.length > 0 ? (
                  <div className="mb-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {owners.map((owner, index) => (
                        <div 
                          key={owner.id || index} 
                          className={`cursor-pointer rounded-lg p-4 transition-all duration-200 ${
                            selectedOwnerId === owner.id 
                              ? 'bg-blue-50 border-2 border-blue-300 shadow-md' 
                              : 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
                          }`}
                          onClick={() => {
                            if (canEdit) {
                              setSelectedOwnerId(owner.id);
                              setOwnerData(owner);
                              // Preencher formulário usando setValue do React Hook Form
                              setValue('ownerName', owner.name || '');
                              setValue('ownerCpf', owner.cpf || '');
                              setValue('ownerEmail', owner.email || '');
                              setValue('ownerPhone', owner.phone || '');
                            }
                          }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                selectedOwnerId === owner.id ? 'bg-blue-200' : 'bg-blue-100'
                              }`}>
                                <span className={`font-semibold text-sm ${
                                  selectedOwnerId === owner.id ? 'text-blue-700' : 'text-blue-600'
                                }`}>
                                  {owner.name?.charAt(0)?.toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">{owner.name}</h3>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  selectedOwnerId === owner.id 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  Proprietário
                                </span>
                              </div>
                            </div>
                            {selectedOwnerId === owner.id && (
                              <div className="text-blue-600">
                                <span className="text-sm">✓ Selecionado</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <span className="w-4 h-4 mr-2">🆔</span>
                              <span>{owner.cpf}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-4 h-4 mr-2">✉️</span>
                              <span className="truncate">{owner.email}</span>
                            </div>
                            {owner.phone && (
                              <div className="flex items-center">
                                <span className="w-4 h-4 mr-2">📞</span>
                                <span>{owner.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-400 text-xl">👤</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum proprietário encontrado</h3>
                    <p className="text-gray-500 mb-4">Esta empresa ainda não possui proprietários cadastrados.</p>
                    {canEdit && (
                      <p className="text-sm text-blue-600">Preencha o formulário abaixo para adicionar o primeiro proprietário.</p>
                    )}
                  </div>
                )}
                

                
                <h2 className="text-2xl text-slate-500 font-bold mb-4 mt-6">
                  {owners.length > 0 ? 'Editar Proprietário' : 'Adicionar Proprietário'}
                </h2>
                
                {canEdit && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="text-blue-500 text-lg">📝</span>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-900 mb-1">
                          {owners.length > 0 ? 'Editar ou Adicionar Proprietário' : 'Criar Primeiro Proprietário'}
                        </h4>
                        <p className="text-sm text-blue-700">
                          {owners.length > 0 
                            ? 'Clique em um card acima para selecionar e editar um proprietário, ou preencha manualmente para adicionar um novo.' 
                            : 'Preencha os dados abaixo para criar o primeiro proprietário desta empresa.'
                          }
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          🔑 Senha padrão: <strong>123456</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid gap-2 md:grid-cols-2">
                  <Input
                    label="Nome do Proprietário:"
                    id="ownerName"
                    defaultValue={ownerData?.name ?? ""}
                    register={register}
                    placeholder="Digite o nome do proprietário"
                    disabled={!canEdit}
                  />
                  <Input
                    label="CPF do Proprietário:"
                    id="ownerCpf"
                    defaultValue={ownerData?.cpf ?? ""}
                    register={register}
                    placeholder="Digite o CPF"
                    disabled={!canEdit}
                    mask="999.999.999-99"
                  />
                  <Input
                    label="Email do Proprietário:"
                    id="ownerEmail"
                    defaultValue={ownerData?.email ?? ""}
                    register={register}
                    placeholder="Digite o email"
                    disabled={!canEdit}
                  />
                  <Input
                    label="Telefone do Proprietário:"
                    id="ownerPhone"
                    defaultValue={ownerData?.phone ?? ""}
                    register={register}
                    placeholder="Digite o telefone"
                    disabled={!canEdit}
                    mask="(99)99999-9999"
                  />
                </div>

                <div className="flex justify-end mb-10 mt-6">
                  {canEdit && (
                    <IconButton
                      type="submit"
                      buttonLabel={labelButton}
                      icon={
                        <path d="M14.3 2.3L5 11.6 1.7 8.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4 4c.2.2.4.3.7.3.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z" />
                      }
                    />
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyForm;