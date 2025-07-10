

const injectedRepliesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUpdates: builder.query({
      query: () => ({
        url: `/updates`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetUpdatesQuery } = injectedRepliesApi;
