import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { File } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

/**
 * Provides functionality to retrieve and manage files through the API with support for pagination and filtering.
 * This endpoint allows users to fetch a list of files, optionally filtered by a specified source.
 * It is designed to be used in applications where file management and retrieval are required.
 * @name GetFiles
 * @param {string} [source] (query) - Optional source of the files
 * @version 1.3
 **/

export const FILES_QUERY_KEY = (source?: string) => {
  const keys = ["FILES"];
  if (source) keys.push(source);
  return keys;
};

export const SET_FILES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof FILES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetFiles>>
) => {
  client.setQueryData(FILES_QUERY_KEY(...keyParams), response);
};

interface GetFilesParams extends InfiniteQueryParams {
  source?: string;
}

export const GetFiles = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  source,
  adminApiParams,
}: GetFilesParams): Promise<ConnectedXMResponse<File[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/files`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      source: source || undefined,
    },
  });

  return data;
};

export const useGetFiles = (
  source?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetFiles>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetFiles>>>(
    FILES_QUERY_KEY(source || "all"),
    (params: InfiniteQueryParams) => GetFiles({ ...params, source }),
    params,
    options
  );
};