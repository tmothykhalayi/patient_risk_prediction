export interface RUser {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
}

export interface User {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
}

export interface Luser {
  password: string;
  role: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: string;
}

export interface LoginResponse {
  foundUser: {
    user_id: number;
    email: string;
    password: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
}

export type TUser = {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  hashedRefreshToken?: string;
  role: string;
  created_at: string;
  updated_at: string;
  token?: string;
};

export interface TIUser {
  user_id: number;
  name: string;
  email: string;
  phone: string;
}

export interface UserAuthenticatedState {
    user:{
        user_id: number
        name: string
        email: string
        phone: string
        role: string
    } | null
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
  }
  
  export interface UserState {
    user: TUser | null;
    loading: boolean;
    error: string | null;
  }