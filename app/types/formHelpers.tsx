import { SignUpFormValues, LoginFormValues, VerifyFormValues } from "./auth.d";

export const signUpInitialValues: SignUpFormValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

export const loginInitialValues: LoginFormValues = {
  email: '',
  password: '',
};

export const verifyInitialValues: VerifyFormValues = {
  otp: '',
};