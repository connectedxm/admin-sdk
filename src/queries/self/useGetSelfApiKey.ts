// useGetSelfApiKey.ts

import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, UserApiKey } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { SELF_API_KEYS_QUERY_KEY } from "./useGetSelfApiKeys";

/**
 * Endpoint to retrieve a specific API key associated with the current user by its unique identifier.
 * This function allows users to fetch details of their own API key using the provided API key ID.
 * @name GetSelfApiKey
 * @param {string} apiKeyId (path) The id of the API key
 * @version 1.3
 **/

export const SELF_API_KEY_QUERY_KEY = (apiKeyId: string) => [
  ...SELF_API_KEYS_QUERY_KEY(),
  apiKeyId,
];

export const SET_SELF_API_KEY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_API_KEY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfApiKey>>
) => {
  client.setQueryData(SELF_API_KEY_QUERY_KEY(...keyParams), response);
};

interface GetSelfApiKeyProps extends SingleQueryParams {
  apiKeyId: string;
}

export const GetSelfApiKey = async ({
  apiKeyId = "",
  adminApiParams,
}: GetSelfApiKeyProps): Promise<ConnectedXMResponse<UserApiKey>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/self/api-keys/${apiKeyId}`);
  return data;
};

export const useGetSelfApiKey = (
  apiKeyId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSelfApiKey>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSelfApiKey>>(
    SELF_API_KEY_QUERY_KEY(apiKeyId),
    (params: SingleQueryParams) => GetSelfApiKey({ apiKeyId, ...params }),
    {
      ...options,
      enabled: !!apiKeyId && (options?.enabled ?? true),
    }
  );
};