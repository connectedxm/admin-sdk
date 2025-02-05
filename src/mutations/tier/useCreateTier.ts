import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Tier, ConnectedXMResponse } from "@src/interfaces";
import { TIERS_QUERY_KEY, SET_TIER_QUERY_DATA } from "@src/queries";
import { TierCreateInputs } from "@src/params";

/**
 * Endpoint to create a new tier within the system.
 * This function allows the creation of a tier by providing the necessary inputs.
 * It is designed to be used in applications where tier management is required.
 * @name CreateTier
 * @param {TierCreateInputs} tier - The inputs required to create a tier
 * @version 1.2
 **/

export interface CreateTierParams extends MutationParams {
  tier: TierCreateInputs;
}

export const CreateTier = async ({
  tier,
  adminApiParams,
  queryClient,
}: CreateTierParams): Promise<ConnectedXMResponse<Tier>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Tier>>(
    `/tiers`,
    tier
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: TIERS_QUERY_KEY() });
    SET_TIER_QUERY_DATA(queryClient, [data.data.id], data);
  }
  return data;
};

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
  >(CreateTier, options, {
    domain: "accounts",
    type: "create",
  });
};