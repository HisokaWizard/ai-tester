import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import type { Customer, CustomerCreate, CustomerUpdate, CustomerSummary } from './types';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.yourcompany.com/v1/',
  prepareHeaders: (headers) => {
    // Добавьте токен авторизации если нужно
    return headers;
  },
  // Используем axios под капотом, но fetchBaseQuery использует fetch по умолчанию. Для axios можно кастомизировать.
});

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery,
  tagTypes: ['Customer'],
  endpoints: (builder) => ({
    getCustomers: builder.query<{ data: CustomerSummary[]; meta: any }, { q?: string; page?: number; limit?: number }>({
      query: (params) => ({ url: 'customers', params }),
      providesTags: ['Customer'],
    }),
    createCustomer: builder.mutation<Customer, CustomerCreate>({
      query: (body) => ({
        url: 'customers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Customer'],
    }),
    getCustomer: builder.query<Customer, string>({
      query: (id) => `customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),
    updateCustomer: builder.mutation<Customer, { id: string; data: CustomerUpdate }>({
      query: ({ id, data }) => ({
        url: `customers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useGetCustomerQuery,
  useUpdateCustomerMutation,
} = customerApi;

export default customerApi;