import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RUser } from '../../types/types';

export const registrationAPI = createApi({
    reducerPath: 'registrationAPI',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        registerUser: builder.mutation<RUser, Partial<RUser>>({
            query: (newUser) => ({
                url: 'auth/signup',
                method: 'POST',
                body: newUser,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),
    }),
});

export default registrationAPI;