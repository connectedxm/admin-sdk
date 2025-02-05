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
 * Endpoint to update a specific tier within the system.
 * This function allows for the modification of tier details by providing the tier ID and the updated tier inputs.
 * It is designed to be used in applications where tier management is required, ensuring that the tier data is kept up-to-date.
 * @name UpdateTier
 * @param {string} tierId - The ID of the tier
 * @param {TierUpdateInputs} tier - The tier update inputs
 * @version 1.2
 **/

export interface UpdateTierParams extends MutationParams {
  tierId: string;
  tier: TierUpdateInputs;
}

export const UpdateTier = async ({
  tierId,
  tier,
  adminApiParams,
  queryClient,
}: UpdateTierParams): Promise<ConnectedXMResponse<Tier>> => {
  if (!tierId) {
    throw Error("Tier ID Undefined");
  }

  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<ConnectedXMResponse<Tier>>(
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