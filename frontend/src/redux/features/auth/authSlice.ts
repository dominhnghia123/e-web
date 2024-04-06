import { setStogare } from "@/app/helper/stogare";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  login: LoginState;
  register: RegisterState;
};

type LoginState = {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  currentUser: IUser | null;
};

type RegisterState = {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
};

const initialState = {
  login: {
    currentUser: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
  } as LoginState,
  register: {
    isLoading: false,
    isError: false,
    isSuccess: false,
  } as RegisterState,
} as InitialState;

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //login
    logInStart: (state) => {
      state.login.isLoading = true;
      state.login.isError = false;
      state.login.isSuccess = false;
    },
    logInError: (state) => {
      state.login.isLoading = false;
      state.login.isError = true;
      state.login.isSuccess = false;
    },
    logInSuccess: (state, action: PayloadAction<any>): any => {
      state.login.isLoading = false;
      state.login.isError = false;
      state.login.isSuccess = true;
      state.login.currentUser = action.payload;
      setStogare("currentUser", JSON.stringify(action.payload));
    },

    //register
    registerStart: (state) => {
      state.register.isLoading = true;
      state.register.isError = false;
      state.register.isSuccess = false;
    },
    registerError: (state) => {
      state.register.isLoading = false;
      state.register.isError = true;
      state.register.isSuccess = false;
    },
    registerSuccess: (state) => {
      state.register.isLoading = false;
      state.register.isError = false;
      state.register.isSuccess = true;
    },
  },
});

export const {
  logInStart,
  logInError,
  logInSuccess,
  registerStart,
  registerError,
  registerSuccess,
} = authSlice.actions;

export default authSlice.reducer;
