import { baseApi } from './baseApi'

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<any[], void>({
      query: () => ({
        url: '/orders',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    }),
  }),
})

export const { useGetOrdersQuery } = ordersApi
