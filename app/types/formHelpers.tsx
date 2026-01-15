import { SignUpFormValues, LoginFormValues, VerifyFormValues, ChangePasswordFormValues } from "./auth.d";

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

export const changePasswordInitialValues: ChangePasswordFormValues = {
  currentPassword: '',
  newPassword: '',
}