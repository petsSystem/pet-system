import { MeUserDTO } from "@dtos/MeUserDTO";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { USER_COOKIE } from "@cookies/cookieConfig";

export async function cookieUserSave(meUser: MeUserDTO) {
  const userParse = JSON.stringify(meUser);
  setCookie(undefined, USER_COOKIE, userParse, {
    maxAge: 60 * 60 * 24 * 10, // 1hour
  });
}

export function cookieUserGet() {
  const cookies = parseCookies();
  const meUser = cookies[USER_COOKIE];
  const parseMeUser: MeUserDTO = JSON.parse(meUser);
  return parseMeUser;
}

export function cookieUserRemove() {
  destroyCookie(null, USER_COOKIE);
}
