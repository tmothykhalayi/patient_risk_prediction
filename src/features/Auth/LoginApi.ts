import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LoginResponse, LoginRequest } from '../../types/types';

export const loginApi = createApi({
  reducerPath: 'authApi',  
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (user) => ({
        url: '/auth/signin',
        method: 'POST',
        body: user,
      }),
    }),
  }),
});

export const { useLoginMutation } = loginApi;

export default loginApi;