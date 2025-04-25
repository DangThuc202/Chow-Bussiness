import { IUserCookie } from "@/types/auth";
import Cookies from "universal-cookie";

const cookies = new Cookies();

// Set login cookies
export const setLoginCookies = (userData: IUserCookie): void => {
  cookies.set("userLogin", userData, { path: "/" });
};

// Get login cookies
export const getLoginCookies = (): IUserCookie | null => {
  const cookiesResult = cookies.get("userLogin");
  if (!cookiesResult) return null;
  return cookiesResult;
};

// Delete login cookies
export const deleteLoginCookies = (): void => {
  cookies.remove("userLogin", { path: "/" });
};

// Set access token with expiration of 24 hours
export const setAccessToken = (token: string): void => {
  cookies.set("accessToken", token, {
    path: "/",
    secure: true,
    sameSite: "strict",
  });
};

// Get access token
export const getAccessToken = (): string | null => {
  return cookies.get("accessToken") || null; // Corrected the cookie name to 'access_token'
};

// Remove access token
export const removeAccessToken = (): void => {
  cookies.remove("accessToken", { path: "/" }); // Corrected the cookie name to 'access_token'
};
