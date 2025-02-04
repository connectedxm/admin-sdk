import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { UserApiKey, ConnectedXMResponse } from "@src/interfaces";
import {
  SELF_API_KEYS_QUERY_KEY,
  SET_SELF_API_KEY_QUERY_DATA,
} from "@src/queries";
import { UserApiKeyCreateInputs } from "@src/params";

/**
 * Endpoint to create a new API key for the current user.
 * This function allows users to generate a new API key for their own use by providing the necessary data for creation.
 * It is designed to be used in applications where users need to manage their own API keys.
 * @name CreateSelfApiKey
 * @param {UserApiKeyCreateInputs} apiKeyData - The data for the API key creation
 * @version 1.2
 **/

export interface CreateSelfApiKeyParams extends MutationParams {
  apiKeyData: UserApiKeyCreateInputs;
}

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