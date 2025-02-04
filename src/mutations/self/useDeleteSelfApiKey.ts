import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { SELF_API_KEYS_QUERY_KEY, SELF_API_KEY_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a self API key.
 * This function allows users to delete their own API key using the provided API key ID.
 * It ensures that the API key is removed from the system and invalidates related queries to maintain data consistency.
 * @name DeleteSelfApiKey
 * @param {string} apiKeyId - The id of the API key to be deleted
 * @version 1.2
 **/
export interface DeleteSelfApiKeyParams extends MutationParams {
  apiKeyId: string;
}

export const DeleteSelfApiKey = async ({
  apiKeyId,
  adminApiParams,
  queryClient,
}: DeleteSelfApiKeyParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/self/api-keys/${apiKeyId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_API_KEYS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: SELF_API_KEY_QUERY_KEY(apiKeyId) });
  }
  return data;
};

export const useDeleteSelfApiKey = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSelfApiKey>>,
      Omit<DeleteSelfApiKeyParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSelfApiKeyParams,
    Awaited<ReturnType<typeof DeleteSelfApiKey>>
  >(DeleteSelfApiKey, options);
};