import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Tier } from "@src/interfaces";
import { MEMBERSHIP_TIERS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Subscriptions
 */
export interface RemoveMembershipTierParams extends MutationParams {
  membershipId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const RemoveMembershipTier = async ({
  membershipId,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveMembershipTierParams): Promise<ConnectedXMResponse<Tier>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete<ConnectedXMResponse<Tier>>(
    `/subscription-products/${membershipId}/tiers/${tierId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: MEMBERSHIP_TIERS_QUERY_KEY(membershipId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Subscriptions
 */
export const useRemoveMembershipTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveMembershipTier>>,
      Omit<RemoveMembershipTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveMembershipTierParams,
    Awaited<ReturnType<typeof RemoveMembershipTier>>
  >(RemoveMembershipTier, options, {
    domain: "subscriptions",
    type: "update",
  });
};
