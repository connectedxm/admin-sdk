// DeleteSelfApiKey.ts

import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { SELF_API_KEYS_QUERY_KEY, SELF_API_KEY_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group SelfApiKeys
 */
export interface DeleteSelfApiKeyParams extends MutationParams {
  apiKeyId: string;
}

/**
 * @category Methods
 * @group SelfApiKeys
 */
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

/**
 * @category Mutations
 * @group SelfApiKeys
 */
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
