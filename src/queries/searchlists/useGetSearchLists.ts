import { ConnectedXMResponse } from "@src/interfaces";
import { SearchList } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group SearchLists
 */
export const SEARCHLISTS_QUERY_KEY = () => ["SEARCHLISTS"];

/**
 * @category Setters
 * @group SearchLists
 */
export const SET_SEARCHLISTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SEARCHLISTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSearchLists>>
) => {
  client.setQueryData(SEARCHLISTS_QUERY_KEY(...keyParams), response);
};

interface GetSearchListsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group SearchLists
 */
export const GetSearchLists = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSearchListsProps): Promise<ConnectedXMResponse<SearchList[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/searchlists`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group SearchLists
 */
export const useGetSearchLists = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSearchLists>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSearchLists>>>(
    SEARCHLISTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSearchLists(params),
    params,
    options,
    "searchlists"
  );
};
