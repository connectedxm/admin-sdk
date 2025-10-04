import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { MembershipPrice, ConnectedXMResponse } from "@src/interfaces";
import { MembershipPriceUpdateInputs } from "@src/params";
import {
  SET_MEMBERSHIP_PRICE_QUERY_DATA,
  MEMBERSHIP_PRICES_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Subscriptions
 */
export interface UpdateMembershipPriceParams extends MutationParams {
  membershipId: string;
  membershipPriceId: string;
  membershipPrice: MembershipPriceUpdateInputs;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const UpdateMembershipPrice = async ({
  membershipId,
  membershipPriceId,
  membershipPrice,
  queryClient,
  adminApiParams,
}: UpdateMembershipPriceParams): Promise<
  ConnectedXMResponse<MembershipPrice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<MembershipPrice>>(
    `/subscription-products/${membershipId}/prices/${membershipPriceId}`,
    membershipPrice
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: MEMBERSHIP_PRICES_QUERY_KEY(membershipId),
    });
    SET_MEMBERSHIP_PRICE_QUERY_DATA(
      queryClient,
      [membershipId, membershipPriceId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Subscriptions
 */
export const useUpdateMembershipPrice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateMembershipPrice>>,
      Omit<UpdateMembershipPriceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateMembershipPriceParams,
    Awaited<ReturnType<typeof UpdateMembershipPrice>>
  >(UpdateMembershipPrice, options);
};
