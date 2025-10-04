import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SearchList } from "@src/interfaces";
import { SEARCHLISTS_QUERY_KEY } from "../searchlists/useGetSearchLists";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group SearchLists
 */
export const SEARCHLIST_QUERY_KEY = (searchListId: string) => [
  ...SEARCHLISTS_QUERY_KEY(),
  searchListId,
];

/**
 * @category Setters
 * @group SearchLists
 */
export const SET_SEARCHLIST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SEARCHLIST_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSearchList>>
) => {
  client.setQueryData(SEARCHLIST_QUERY_KEY(...keyParams), response);
};

interface GetSearchListProps extends SingleQueryParams {
  searchListId: string;
}

/**
 * @category Queries
 * @group SearchLists
 */
export const GetSearchList = async ({
  searchListId,
  adminApiParams,
}: GetSearchListProps): Promise<ConnectedXMResponse<SearchList>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/searchlists/${searchListId}`);
  return data;
};
/**
 * @category Hooks
 * @group SearchLists
 */
export const useGetSearchList = (
  searchListId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSearchList>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSearchList>>(
    SEARCHLIST_QUERY_KEY(searchListId),
    (params: SingleQueryParams) => GetSearchList({ searchListId, ...params }),
    {
      ...options,
      enabled: !!searchListId && (options?.enabled ?? true),
    }
  );
};
