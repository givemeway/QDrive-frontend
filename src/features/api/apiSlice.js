import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://backup-8toq.onrender.com/app",
  }),
  endpoints: (builder) => ({
    deleteTrashItems: builder.mutation({
      query: (data) => ({
        url: "/deleteTrashItems",
        method: "POST",
        body: { items: data.items },

        headers: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
      }),
    }),
    getCSRFToken: builder.query({
      query: () => "/csrftoken",
    }),
    moveItems: builder.mutation({
      query: (data) => ({
        url: "/v2/moveItems?to=" + data.to,
        method: "POST",
        body: data.items,
        headers: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
      }),
    }),
    copyItems: builder.mutation({
      query: (data) => ({
        url: "/copyItems?to=" + data.to,
        method: "POST",
        body: data.items,
        headers: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
      }),
    }),
    getFolders: builder.mutation({
      query: (params) => ({
        url: "/getSubFolders",
        method: "POST",
        headers: { path: params.path, "X-CSRF-Token": params.CSRFToken },
      }),
    }),
    deleteItems: builder.mutation({
      query: (data) => ({
        url: "/delete",
        method: "DELETE",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
        body: data.items,
      }),
    }),
    restoreTrashItems: builder.mutation({
      query: (data) => ({
        url: "/restoreTrashItems",
        method: "POST",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
        body: { items: data.items },
      }),
    }),
    renameItem: builder.mutation({
      query: (data) => ({
        url: "/renameItem",
        method: "PATCH",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
        body: data.items,
      }),
    }),
    getBatchTrashItems: builder.mutation({
      query: (data) => ({
        url: "/trashBatch?" + data.params,
        method: "POST",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
        body: {},
      }),
    }),
    browseFolder: builder.mutation({
      query: (data) => ({
        url: `/browseFolder?d=${data.device}&dir=${data.curDir}&sort=${data.sort}&start=${data.start}&page=${data.end}`,
        method: "GET",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),
    createShare: builder.mutation({
      query: (data) => ({
        url: "/createShare?t=" + data.type,
        method: "POST",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
        body: data.items,
      }),
    }),
    downloadItems: builder.mutation({
      query: (data) => ({
        url: "/get_download_zip",
        method: "POST",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
        body: data.items,
      }),
    }),
    getFileVersion: builder.mutation({
      query: (data) => ({
        url: "/getFileVersion?origin=" + data.origin,
        method: "GET",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
      }),
    }),
    searchItems: builder.mutation({
      query: (data) => ({
        url: "/search?param=" + data.param,
        method: "GET",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
      }),
    }),
    getShares: builder.mutation({
      query: (data) => ({
        url: "/sh/getSharedLinks",
        method: "GET",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
      }),
    }),
    getPhotos: builder.mutation({
      query: () => ({
        url: "/getPhotos",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getPhotoPreviewURL: builder.mutation({
      query: (data) => ({
        url: `/photopreview?path=${data.path}&filename=${data.filename}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    validateShareLink: builder.mutation({
      query: (data) => ({
        url: `/sh/validate?id=${data.id}&k=${data.k}&t=${data.t}&dl=${data.dl}&nav=${data.nav}`,
        method: "GET",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
      }),
    }),
    browseSharedItems: builder.mutation({
      query: (data) => ({
        url: `/sh?id=${data.id}&k=${data.k}&t=${data.t}&dl=${data.dl}&nav=${data.nav}&skip=${data.start}&take=${data.page}`,
        method: "GET",
        headeres: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/user/login",
        method: "POST",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
          Authorization: `Basic ${data.encodedData}`,
          body: { usernametype: "username" },
        },
      }),
    }),
    verifySession: builder.mutation({
      query: (data) => ({
        url: "/user/verifySession",
        method: "GET",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
        },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "GET",
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: "/user/signup",
        method: "POST",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
          "Content-Type": "application/json",
        },
        body: { ...data.body },
      }),
    }),
    checkUsername: builder.mutation({
      query: (data) => ({
        url: "/user/validateusername?username=" + data.value,
        method: "GET",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
        },
      }),
    }),
    getTrash: builder.mutation({
      query: (data) => ({
        url: "/trash",
        method: "GET",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
        },
      }),
    }),
    deleteShare: builder.mutation({
      query: (data) => ({
        url: `/sh/deleteShare?id=${data.id}`,
        method: "DELETE",
        headers: {
          "X-CSRF-Token": data.CSRFToken,
        },
      }),
    }),
  }),
});

export const {
  useDeleteTrashItemsMutation,
  useGetCSRFTokenQuery,
  useMoveItemsMutation,
  useCopyItemsMutation,
  useGetFoldersMutation,
  useDeleteItemsMutation,
  useRestoreTrashItemsMutation,
  useRenameItemMutation,
  useGetBatchTrashItemsMutation,
  useBrowseFolderMutation,
  useCreateShareMutation,
  useDownloadItemsMutation,
  useGetFileVersionMutation,
  useSearchItemsMutation,
  useGetSharesMutation,
  useGetPhotosMutation,
  useGetPhotoPreviewURLMutation,
  useValidateShareLinkMutation,
  useBrowseSharedItemsMutation,
  useLoginMutation,
  useVerifySessionMutation,
  useLogoutMutation,
  useSignupMutation,
  useCheckUsernameMutation,
  useGetTrashMutation,
  useDeleteShareMutation,
} = apiSlice;
