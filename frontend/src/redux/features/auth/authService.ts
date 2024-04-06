"use client";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

//login user
export const logInUser = async (dataLogin: any, setDataLoginError: any) => {
  try {
    const { data } = await axios.post(
      `${process.env.BASE_HOST}/user/login`,
      dataLogin
    );
    return data;
  } catch (error: any) {
    const err = error as AxiosError<{
      message: { property: string; message: string }[];
    }>;
    if (err.response?.data?.message) {
      err.response.data.message?.forEach((value) => {
        if (value.property === "email") {
          setDataLoginError((prev: any) => ({
            ...prev,
            emailError: value.message,
            loginError: "",
          }));
        }
        if (value.property === "password") {
          setDataLoginError((prev: any) => ({
            ...prev,
            passwordError: value.message,
            loginError: "",
          }));
        }
      });
    }
  }
};

//register
export const registerUser = async (
  dataSignup: any,
  setDataSignupError: any
) => {
  try {
    const { data } = await axios.post(
      `${process.env.BASE_HOST}/user/register`,
      dataSignup
    );
    return data;
  } catch (error: any) {
    const err = error as AxiosError<{
      message: { property: string; message: string }[];
    }>;
    if (err.response?.data?.message) {
      err.response.data.message?.forEach((value) => {
        if (value.property === "username") {
          setDataSignupError((prev: any) => ({
            ...prev,
            usernameError: value.message,
          }));
        }
        if (value.property === "email") {
          setDataSignupError((prev: any) => ({
            ...prev,
            emailError: value.message,
          }));
        }
        if (value.property === "password") {
          setDataSignupError((prev: any) => ({
            ...prev,
            passwordError: value.message,
          }));
        }
        if (value.property === "mobile") {
          setDataSignupError((prev: any) => ({
            ...prev,
            mobileError: value.message,
          }));
        }
      });
    }
  }
};
