"use client";
import { createContext, ReactNode, useState, useEffect } from "react";

import {
  cookieAuthGet,
  cookieAuthRemove,
  cookieAuthSave,
} from "@cookies/cookieAuth";

import { UrlsEnum } from "@enums/index";
import { api } from "@services/api";

export type AuthContextDataProps = {
  signIn: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  alterPassword: ({ oldPassword, newPassword }: AlterPassword) => Promise<void>;
  isAuthenticated?: boolean;
  token: string;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

type UserTokenProps = {
  token: string;
};

type AlterPassword = {
  oldPassword: string;
  newPassword: string;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [token, setToken] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingUserTokenCookieData, setIsLoadingUserTokenCookieData] =
    useState(true);

  async function userTokenUpdate({ token }: UserTokenProps) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setToken(token);
  }

  async function cookieUserTokenSave({ token }: UserTokenProps) {
    try {
      await cookieAuthSave(token);
      userTokenUpdate({ token });
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserTokenCookieData(false);
    }
  }

  async function signIn(username: string, password: string) {
    try {
      const { data } = await api.post(UrlsEnum.AUTH, { username, password });
      if (data && (data.token || data.accessToken)) {
        await cookieUserTokenSave({ token: data.token });
        setIsAuthenticated(true);
        // userTokenUpdate({ token });

        // navigate.replace("/admin");
      }
    } catch (error) {
      throw error;
    }
  }

  async function forgotPassword(username: string) {
    try {
      const { data } = await api.post(UrlsEnum.FORGET, { username });
    } catch (error) {
      throw error;
    }
  }

  async function alterPassword({ oldPassword, newPassword }: AlterPassword) {
    try {
      await api.patch(UrlsEnum.USERS_PASSWORD, {
        oldPassword,
        newPassword,
      });
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserTokenCookieData(true);
      setToken("");
      api.defaults.headers.common = {
        Authorization: "",
      };
      cookieAuthRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserTokenCookieData(false);
    }
  }

  async function loadUserData() {
    try {
      const token = cookieAuthGet();
      if (token) {
        userTokenUpdate({ token });
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserTokenCookieData(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        forgotPassword,
        signOut,
        alterPassword,
        isAuthenticated,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
