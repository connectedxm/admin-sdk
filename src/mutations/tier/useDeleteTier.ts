import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { TIERS_QUERY_KEY, TIER_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific tier and invalidate related queries.
 * This function allows the removal of a tier by its unique identifier and ensures that any cached queries related to tiers are invalidated.
 * It is designed to be used in applications where tier management is required, ensuring data consistency by updating the cache.
 * @name DeleteTier
 * @param {string} tierId (path) - The id of the tier to be deleted
 * @version 1.3
 **/
export interface DeleteTierParams extends MutationParams {
  tierId: string;
}

export const DeleteTier = async ({
  tierId,
  adminApiParams,
  queryClient,
}: DeleteTierParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/tiers/${tierId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: TIERS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: TIER_QUERY_KEY(tierId) });
  }
  return data;
};

export const useDeleteTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteTier>>,
      Omit<DeleteTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteTierParams,
    Awaited<ReturnType<typeof DeleteTier>>
  >(DeleteTier, options, {
    domain: "accounts",
    type: "del",
  });
};