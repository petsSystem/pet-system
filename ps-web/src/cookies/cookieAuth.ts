import { UserDTO } from "@dtos/UserDTO";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { AUTH_TOKEN_COOKIE } from "@cookies/cookieConfig";

export async function cookieAuthSave(token: string) {
  setCookie(undefined, AUTH_TOKEN_COOKIE, token, {
    maxAge: 60 * 60 * 24 * 10, // 1hour
  });
}

export function cookieAuthGet() {
  const cookies = parseCookies();
  const token = cookies[AUTH_TOKEN_COOKIE];
  return token;
}

export function cookieAuthRemove() {
  destroyCookie(null, AUTH_TOKEN_COOKIE);
}
