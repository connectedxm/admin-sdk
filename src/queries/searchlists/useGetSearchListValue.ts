import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SearchListValue } from "@src/interfaces";
import { SEARCHLIST_VALUES_QUERY_KEY } from "../searchlists/useGetSearchListValues";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group SearchListValues
 */
export const SEARCHLIST_VALUE_QUERY_KEY = (searchListId: string, valueId: string) => [
  ...SEARCHLIST_VALUES_QUERY_KEY(searchListId),
  valueId,
];

/**
 * @category Setters
 * @group SearchListValues
 */
export const SET_SEARCHLIST_VALUE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SEARCHLIST_VALUE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSearchListValue>>
) => {
  client.setQueryData(SEARCHLIST_VALUE_QUERY_KEY(...keyParams), response);
};

interface GetSearchListValueProps extends SingleQueryParams {
  searchListId: string;
  valueId: string;
}

/**
 * @category Queries
 * @group SearchListValues
 */
export const GetSearchListValue = async ({
  searchListId,
  valueId,
  adminApiParams,
}: GetSearchListValueProps): Promise<ConnectedXMResponse<SearchListValue>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/searchlists/${searchListId}/values/${valueId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group SearchListValues
 */
export const useGetSearchListValue = (
  searchListId: string = "",
  valueId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSearchListValue>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSearchListValue>>(
    SEARCHLIST_VALUE_QUERY_KEY(searchListId, valueId),
    (params: SingleQueryParams) =>
      GetSearchListValue({ searchListId, valueId, ...params }),
    {
      ...options,
      enabled: !!searchListId && !!valueId && (options?.enabled ?? true),
    },
    "searchlists"
  );
};
