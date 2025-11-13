"use client";
import { api } from "@services/api";
import { createContext, ReactNode, useEffect, useState } from "react";
import { cookieUserSave, cookieUserGet } from "@cookies/cookieMeUser";
import { MeUserDTO } from "../dtos/MeUserDTO";
import { UrlsEnum } from "../enums";

interface ProfileContextProps {
  getProfile: () => Promise<any>;
  profile: MeUserDTO | null | undefined;
  updateProfile: (companyId: string) => Promise<any>;
}

export const ProfileContext = createContext<ProfileContextProps>(
  {} as ProfileContextProps
);

export const ProfileProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [profile, setProfile] = useState<MeUserDTO>();

  async function userMeUpdate(meUser: MeUserDTO) {
    setProfile(meUser);
  }

  async function getProfile() {
    try {
      const { data } = await api.get(UrlsEnum.ME);
      if (data) {
        await cookieUserSave(data);
        setProfile(data);
      }
    } catch (error) {
      throw error;
    }
  }

  async function updateProfile(companyId: string) {
    console.log("updateProfile: ", companyId);
    try {
      const { data } = await api.patch(UrlsEnum.USERS_CURRENT, [
        {
          op: "replace",
          path: "/currentCompanyId",
          value: companyId,
        },
      ]);
      if (data) {
        console.log("data", data);
        setProfile(data);
      }
    } catch (error) {
      throw error;
    }
  }

  async function loadUserData() {
    try {
      const userMeCookie: MeUserDTO = cookieUserGet();
      if (userMeCookie) {
        userMeUpdate(userMeCookie);
      }
    } catch (error) {
      throw error;
    } finally {
      // setIsLoadingUserTokenCookieData(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, getProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
