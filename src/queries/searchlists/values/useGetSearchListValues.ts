import { ConnectedXMResponse } from "@src/interfaces";
import { SearchListValue } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group SearchListValues
 */
export const SEARCHLIST_VALUES_QUERY_KEY = (searchListId: string) => [
  "SEARCHLIST_VALUES",
  searchListId,
];

/**
 * @category Setters
 * @group SearchListValues
 */
export const SET_SEARCHLIST_VALUES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SEARCHLIST_VALUES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSearchListValues>>
) => {
  client.setQueryData(SEARCHLIST_VALUES_QUERY_KEY(...keyParams), response);
};

interface GetSearchListValuesProps extends InfiniteQueryParams {
  searchListId: string;
}

/**
 * @category Queries
 * @group SearchListValues
 */
export const GetSearchListValues = async ({
  searchListId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSearchListValuesProps): Promise<
  ConnectedXMResponse<SearchListValue[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/searchlists/${searchListId}/values`, {
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
 * @group SearchListValues
 */
export const useGetSearchListValues = (
  searchListId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSearchListValues>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSearchListValues>>
  >(
    SEARCHLIST_VALUES_QUERY_KEY(searchListId),
    (queryParams: InfiniteQueryParams) =>
      GetSearchListValues({ searchListId, ...queryParams }),
    params,
    {
      ...options,
      enabled: !!searchListId && (options?.enabled ?? true),
    }
  );
};
