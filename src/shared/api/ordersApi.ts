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
      providesTags: [{ type: 'Orders' }],
    }),
    createOrder: build.mutation<any, { title: string; description: string; budget: number }>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      invalidatesTags: [{ type: 'Orders' }],
    }),
    deleteOrder: build.mutation<any, number>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      invalidatesTags: [{ type: 'Orders' }],
    }),
    assignFreelancerToOrder: build.mutation<any, { orderId: number; freelancer_id: number }>({
      query: ({ orderId, freelancer_id }) => ({
        url: `/orders/${orderId}/assign`,
        method: 'PATCH',
        body: { freelancer_id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      invalidatesTags: [{ type: 'Orders' }],
    }),
    getFreelancerOrders: build.query<any[], number>({
      query: (freelancerId) => ({
        url: `/orders/freelancer/${freelancerId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: [{ type: 'Orders' }],
    }),
    declineOrderByFreelancer: build.mutation<any, number>({
      query: (orderId) => ({
        url: `/orders/${orderId}/decline`,
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      invalidatesTags: [{ type: 'Orders' }],
    }),
  }),
})

export const { useGetOrdersQuery, useCreateOrderMutation, useDeleteOrderMutation, useAssignFreelancerToOrderMutation, useGetFreelancerOrdersQuery, useDeclineOrderByFreelancerMutation } = ordersApi
