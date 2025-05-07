import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, Self } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Self
 */
export const SELF_QUERY_KEY = () => ["SELF"];

/**
 * @category Setters
 * @group Self
 */
export const SET_SELF_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelf>>
) => {
  client.setQueryData(SELF_QUERY_KEY(...keyParams), response);
};

interface GetSelfProps extends SingleQueryParams {}

/**
 * @category Queries
 * @group Self
 */
export const GetSelf = async ({
  adminApiParams,
}: GetSelfProps): Promise<ConnectedXMResponse<Self>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/self`);
  return data;
};
/**
 * @category Hooks
 * @group Self
 */
export const useGetSelf = (
  options: SingleQueryOptions<ReturnType<typeof GetSelf>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSelf>>(
    SELF_QUERY_KEY(),
    (params: SingleQueryParams) =>
      GetSelf({
        ...params,
      }),
    options
  );
};
