// useGetSelfApiKey.ts

import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, UserApiKey } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { SELF_API_KEYS_QUERY_KEY } from "./useGetSelfApiKeys";

/**
 * @category Keys
 * @group SelfApiKeys
 */
export const SELF_API_KEY_QUERY_KEY = (apiKeyId: string) => [
  ...SELF_API_KEYS_QUERY_KEY(),
  apiKeyId,
];

/**
 * @category Setters
 * @group SelfApiKeys
 */
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

/**
 * @category Queries
 * @group SelfApiKeys
 */
export const GetSelfApiKey = async ({
  apiKeyId = "",
  adminApiParams,
}: GetSelfApiKeyProps): Promise<ConnectedXMResponse<UserApiKey>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/self/api-keys/${apiKeyId}`);
  return data;
};

/**
 * @category Hooks
 * @group SelfApiKeys
 */
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
