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
export interface AddMembershipTierParams extends MutationParams {
  membershipId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const AddMembershipTier = async ({
  membershipId,
  tierId,
  adminApiParams,
  queryClient,
}: AddMembershipTierParams): Promise<ConnectedXMResponse<Tier>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<ConnectedXMResponse<Tier>>(
    `/subscription-products/${membershipId}/tiers/${tierId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: MEMBERSHIP_TIERS_QUERY_KEY(membershipId),
    });
  }
  return { ...data };
};

/**
 * @category Mutations
 * @group Subscriptions
 */
export const useAddMembershipTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddMembershipTier>>,
      Omit<AddMembershipTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddMembershipTierParams,
    Awaited<ReturnType<typeof AddMembershipTier>>
  >(AddMembershipTier, options);
};
