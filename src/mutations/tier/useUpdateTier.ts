import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Tier, ConnectedXMResponse } from "@src/interfaces";
import { SET_TIER_QUERY_DATA, TIERS_QUERY_KEY } from "@src/queries";
import { TierUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Tier
 */
export interface UpdateTierParams extends MutationParams {
  tierId: string;
  tier: TierUpdateInputs;
}

/**
 * @category Methods
 * @group Tier
 */
export const UpdateTier = async ({
  tierId,
  tier,
  adminApiParams,
  queryClient,
}: UpdateTierParams): Promise<ConnectedXMResponse<Tier>> => {
  if (!tierId) {
    throw Error("Tier ID Undefined");
  }

  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<Tier>>(
    `/tiers/${tierId}`,
    {
      ...tier,
      id: undefined,
      image: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      _count: undefined,
    }
  );
  if (queryClient && data.status === "ok") {
    SET_TIER_QUERY_DATA(queryClient, [tierId || data.data?.id], data);
    queryClient.invalidateQueries({ queryKey: TIERS_QUERY_KEY() });
  }
  return data;
};

/**
 * @category Mutations
 * @group Tier
 */
export const useUpdateTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateTier>>,
      Omit<UpdateTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateTierParams,
    Awaited<ReturnType<typeof UpdateTier>>
  >(UpdateTier, options, {
    domain: "accounts",
    type: "update",
  });
};
