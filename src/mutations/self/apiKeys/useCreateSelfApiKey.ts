// CreateSelfApiKey.ts

import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { UserApiKey, ConnectedXMResponse } from "@src/interfaces";
import {
  SELF_API_KEYS_QUERY_KEY,
  SET_SELF_API_KEY_QUERY_DATA,
} from "@src/queries";
import { UserApiKeyCreateInputs } from "@src/params";

/**
 * @category Params
 * @group SelfApiKeys
 */
export interface CreateSelfApiKeyParams extends MutationParams {
  apiKeyData: UserApiKeyCreateInputs;
}

/**
 * @category Methods
 * @group SelfApiKeys
 */
export const CreateSelfApiKey = async ({
  apiKeyData,
  adminApiParams,
  queryClient,
}: CreateSelfApiKeyParams): Promise<ConnectedXMResponse<UserApiKey>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<UserApiKey>>(
    `/self/api-keys`,
    apiKeyData
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_API_KEYS_QUERY_KEY() });
    SET_SELF_API_KEY_QUERY_DATA(queryClient, [data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group SelfApiKeys
 */
export const useCreateSelfApiKey = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSelfApiKey>>,
      Omit<CreateSelfApiKeyParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSelfApiKeyParams,
    Awaited<ReturnType<typeof CreateSelfApiKey>>
  >(CreateSelfApiKey, options);
};
