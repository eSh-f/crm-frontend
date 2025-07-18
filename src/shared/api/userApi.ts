import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query({
      query: () => ({
        url: '/user/me',
        method: 'GET',
      }),
    }),
    updateProfile: build.mutation({
      query: (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              formData.append(key, value);
            } else {
              formData.append(key, String(value));
            }
          }
        });
        return {
          url: '/user/me',
          method: 'PUT',
          body: formData,
        };
      },
    }),
    changePassword: build.mutation({
      query: (data) => ({
        url: '/user/me/password',
        method: 'PUT',
        body: data,
      }),
    }),
    getUserById: build.query<any, number>({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation, useGetUserByIdQuery } = userApi; 