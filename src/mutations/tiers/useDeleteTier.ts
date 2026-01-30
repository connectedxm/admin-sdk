import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { TIERS_QUERY_KEY, TIER_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Tier
 */
export interface DeleteTierParams extends MutationParams {
  tierId: string;
}

/**
 * @category Methods
 * @group Tier
 */
export const DeleteTier = async ({
  tierId,
  adminApiParams,
  queryClient,
}: DeleteTierParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/tiers/${tierId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: TIERS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: TIER_QUERY_KEY(tierId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Tier
 */
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
  >(DeleteTier, options);
};
