import axios from "axios";
import { AppError } from "@utils/AppError";
import { UrlsEnum } from "../enums";

// const apiAuth = "http://localhost:3333";
const apiAuth = process.env.NEXT_PUBLIC_API_URL; //UrlsEnum.BASE_PROD;

const api = axios.create({
  baseURL: apiAuth,
  headers: {
    "Content-Type": "application/json-patch+json",
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("error", error);
    if (error.response && error.response.data) {
      return Promise.reject(
        new AppError(error.response.data.message || error.response.data.detail)
      );
    } else {
      return Promise.reject(error);
    }
  }
);

export { api };
