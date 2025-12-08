import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:3000" }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: builder => ({}),
});

export const {} = api;
export default api;
