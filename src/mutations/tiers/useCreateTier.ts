import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { Tier, ConnectedXMResponse } from "@src/interfaces";
import { TIERS_QUERY_KEY, SET_TIER_QUERY_DATA } from "@src/queries";
import { TierCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Tier
 */
export interface CreateTierParams extends MutationParams {
  tier: TierCreateInputs;
}

/**
 * @category Methods
 * @group Tier
 */
export const CreateTier = async ({
  tier,
  adminApiParams,
  queryClient,
}: CreateTierParams): Promise<ConnectedXMResponse<Tier>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Tier>>(
    `/tiers`,
    tier
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: TIERS_QUERY_KEY() });
    SET_TIER_QUERY_DATA(queryClient, [data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Tier
 */
export const useCreateTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateTier>>,
      Omit<CreateTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateTierParams,
    Awaited<ReturnType<typeof CreateTier>>
  >(CreateTier, options);
};
