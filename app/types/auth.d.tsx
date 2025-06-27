export interface SignUpFormValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface VerifyFormValues {
  otp: string;
}

export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
}