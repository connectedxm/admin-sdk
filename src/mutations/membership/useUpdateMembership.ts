import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Membership, ConnectedXMResponse } from "@src/interfaces";
import { MembershipUpdateInputs } from "@src/params";
import { MEMBERSHIPS_QUERY_KEY, MEMBERSHIP_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Subscriptions
 */
export interface UpdateMembershipParams extends MutationParams {
  membershipId: string;
  membership: MembershipUpdateInputs;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const UpdateMembership = async ({
  membershipId,
  membership,
  queryClient,
  adminApiParams,
}: UpdateMembershipParams): Promise<ConnectedXMResponse<Membership>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<Membership>>(
    `/subscription-products/${membershipId}`,
    membership
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: MEMBERSHIPS_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: MEMBERSHIP_QUERY_KEY(membershipId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Subscriptions
 */
export const useUpdateMembership = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateMembership>>,
      Omit<UpdateMembershipParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateMembershipParams,
    Awaited<ReturnType<typeof UpdateMembership>>
  >(UpdateMembership, options);
};
