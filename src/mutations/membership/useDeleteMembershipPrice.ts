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
export interface DeleteMembershipPriceParams extends MutationParams {
  membershipId: string;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const DeleteMembershipPrice = async ({
  membershipId,
  adminApiParams,
  queryClient,
}: DeleteMembershipPriceParams): Promise<ConnectedXMResponse<void>> => {
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
export const useDeleteMembershipPrice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteMembershipPrice>>,
      Omit<DeleteMembershipPriceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteMembershipPriceParams,
    Awaited<ReturnType<typeof DeleteMembershipPrice>>
  >(DeleteMembershipPrice, options);
};
