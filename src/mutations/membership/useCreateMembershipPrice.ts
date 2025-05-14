import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { MembershipPrice, ConnectedXMResponse } from "@src/interfaces";
import {
  MEMBERSHIP_PRICES_QUERY_KEY,
  SET_MEMBERSHIP_PRICE_QUERY_DATA,
} from "@src/queries";
import { MembershipPriceCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Subscriptions
 */
export interface CreateMembershipPriceParams extends MutationParams {
  membershipId: string;
  membershipPrice: MembershipPriceCreateInputs;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const CreateMembershipPrice = async ({
  membershipId,
  membershipPrice,
  adminApiParams,
  queryClient,
}: CreateMembershipPriceParams): Promise<
  ConnectedXMResponse<MembershipPrice>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<ConnectedXMResponse<MembershipPrice>>(
    `/subscription-products/${membershipId}/prices`,
    membershipPrice
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: MEMBERSHIP_PRICES_QUERY_KEY(membershipId),
    });
    SET_MEMBERSHIP_PRICE_QUERY_DATA(
      queryClient,
      [membershipId, data?.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Subscriptions
 */
export const useCreateMembershipPrice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateMembershipPrice>>,
      Omit<CreateMembershipPriceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateMembershipPriceParams,
    Awaited<ReturnType<typeof CreateMembershipPrice>>
  >(CreateMembershipPrice, options, {
    domain: "subscriptions",
    type: "create",
  });
};
