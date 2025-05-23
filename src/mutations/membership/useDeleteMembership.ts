import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { MEMBERSHIPS_QUERY_KEY, MEMBERSHIP_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Subscriptions
 */
export interface DeleteMembershipParams extends MutationParams {
  membershipId: string;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const DeleteMembership = async ({
  membershipId,
  adminApiParams,
  queryClient,
}: DeleteMembershipParams): Promise<ConnectedXMResponse<void>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete<ConnectedXMResponse<void>>(
    `/subscription-products/${membershipId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: MEMBERSHIPS_QUERY_KEY(),
    });
    queryClient.removeQueries({
      queryKey: MEMBERSHIP_QUERY_KEY(membershipId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Subscriptions
 */
export const useDeleteMembership = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteMembership>>,
      Omit<DeleteMembershipParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteMembershipParams,
    Awaited<ReturnType<typeof DeleteMembership>>
  >(DeleteMembership, options, {
    domain: "subscriptions",
    type: "del",
  });
};
