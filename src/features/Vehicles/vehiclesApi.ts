import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  status: 'available' | 'rented' | 'maintenance';
  location: string;
  revenue: number;
  imageUrl?: string;
  price?: number;
}

export const vehiclesAPI = createApi({
  reducerPath: 'vehiclesAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/vehicles',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Vehicles'],
  endpoints: (builder) => ({
    getVehicles: builder.query<Vehicle[], void>({
      query: () => '/all',
      providesTags: ['Vehicles'],
    }),
    
    getVehicle: builder.query<Vehicle, string>({
      query: (id) => `/${id}`,
      providesTags: ['Vehicles'],
    }),
    
    createVehicle: builder.mutation<Vehicle, Partial<Vehicle>>({
      query: (newVehicle) => ({
        url: '/create',
        method: 'POST',
        body: newVehicle,
      }),
      invalidatesTags: ['Vehicles'],
    }),
    
    updateVehicle: builder.mutation<Vehicle, { id: string; data: Partial<Vehicle> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Vehicles'],
    }),
    
    deleteVehicle: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vehicles'],
    }),
  }),
});

export const {
  useGetVehiclesQuery,
  useGetVehicleQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = vehiclesAPI;
