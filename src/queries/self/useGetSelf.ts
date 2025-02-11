import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { User } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * Endpoint to retrieve the current user's data.
 * This function fetches the details of the user who is currently authenticated.
 * It is designed to be used in applications where user-specific data is required.
 * @name GetSelf
 * @version 1.3
 **/

export const SELF_QUERY_KEY = () => ["SELF"];

export const SET_SELF_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelf>>
) => {
  client.setQueryData(SELF_QUERY_KEY(...keyParams), response);
};

interface GetSelfProps extends SingleQueryParams {}

export const GetSelf = async ({
  adminApiParams,
}: GetSelfProps): Promise<ConnectedXMResponse<User>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/self`);
  return data;
};

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