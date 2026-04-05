import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Booking {
  id: string;
  vehicle: string;
  pickupDate: string;
  returnDate: string;
  location: string;
  status: 'active' | 'upcoming' | 'completed' | 'confirmed' | 'pending';
  price: number;
  imageUrl?: string;
  customer?: string;
  amount?: number;
  date?: string;
}

export const bookingsAPI = createApi({
  reducerPath: 'bookingsAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/bookings',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Bookings'],
  endpoints: (builder) => ({
    getCustomerBookings: builder.query<Booking[], void>({
      query: () => '/customer',
      providesTags: ['Bookings'],
    }),
    
    getAllBookings: builder.query<Booking[], void>({
      query: () => '/all',
      providesTags: ['Bookings'],
    }),
    
    getBooking: builder.query<Booking, string>({
      query: (id) => `/${id}`,
      providesTags: ['Bookings'],
    }),
    
    createBooking: builder.mutation<Booking, Partial<Booking>>({
      query: (newBooking) => ({
        url: '/create',
        method: 'POST',
        body: newBooking,
      }),
      invalidatesTags: ['Bookings'],
    }),
    
    updateBooking: builder.mutation<Booking, { id: string; data: Partial<Booking> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Bookings'],
    }),
    
    deleteBooking: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bookings'],
    }),
  }),
});

export const {
  useGetCustomerBookingsQuery,
  useGetAllBookingsQuery,
  useGetBookingQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingsAPI;
