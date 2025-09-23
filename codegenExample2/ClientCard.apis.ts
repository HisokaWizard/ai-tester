import { createApi, BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import type {
  Customer,
  CustomerSummary,
  CustomerCreate,
  CustomerUpdate,
  Address,
  ContactPerson,
  ContactPersonCreate,
  ContractSummary,
  CustomerStatistics,
  InteractionLogEntry,
  PaginationMeta,
  Error as ApiError
} from './types';

type AxiosBaseQueryConfig = {
  baseUrl?: string;
};

const axiosBaseQuery = ({ baseUrl }: AxiosBaseQueryConfig = { baseUrl: 'https://api.yourcompany.com/v1/' }): BaseQueryFn<string | FetchArgs, unknown, FetchArgs> =>
  async ({ url, method = 'get', data, params, ...rest }) => {
    const options: AxiosRequestConfig = {
      url: baseUrl + url,
      method,
      data,
      params,
      ...rest,
    };
    try {
      const result = await axios(options);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Customer'],
  endpoints: (builder) => ({
    getCustomers: builder.query<{ data: CustomerSummary[]; meta: PaginationMeta }, { q?: string; page?: number; limit?: number }>({
      query: (params) => ({ url: 'customers', params }),
      providesTags: ['Customer'],
    }),
    getCustomer: builder.query<Customer, string>({
      query: (customerId) => `customers/${customerId}`,
      providesTags: (result, error, customerId) => [{ type: 'Customer', id: customerId }],
    }),
    createCustomer: builder.mutation<Customer, CustomerCreate>({
      query: (body) => ({
        url: 'customers',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Customer'],
    }),
    updateCustomer: builder.mutation<Customer, CustomerUpdate & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `customers/${id}`,
        method: 'PUT',
        data: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} = customerApi;

export type { Customer, CustomerSummary, CustomerCreate, CustomerUpdate, Address, ContactPerson, ContactPersonCreate, ContractSummary, CustomerStatistics, InteractionLogEntry, PaginationMeta, ApiError };