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
 * @category Keys
 * @group Files
 */
export const FILES_QUERY_KEY = (source?: string) => {
  const keys = ["FILES"];
  if (source) keys.push(source);
  return keys;
};

/**
 * @category Setters
 * @group Files
 */
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

/**
 * @category Queries
 * @group Files
 */
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
/**
 * @category Hooks
 * @group Files
 */
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
