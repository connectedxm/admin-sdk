import { GetAdminAPI } from "@src/AdminAPI";
import { Membership, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { MEMBERSHIPS_QUERY_KEY, SET_MEMBERSHIP_QUERY_DATA } from "@src/queries";
import { MembershipCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Subscriptions
 */
export interface CreateMembershipParams extends MutationParams {
  membership: MembershipCreateInputs;
}

/**
 * @category Methods
 * @group Subscriptions
 */
export const CreateMembership = async ({
  membership,
  adminApiParams,
  queryClient,
}: CreateMembershipParams): Promise<ConnectedXMResponse<Membership>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<ConnectedXMResponse<Membership>>(
    `/subscription-products`,
    membership
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: MEMBERSHIPS_QUERY_KEY(),
    });
    SET_MEMBERSHIP_QUERY_DATA(queryClient, [data?.data?.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Subscriptions
 */
export const useCreateMembership = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateMembership>>,
      Omit<CreateMembershipParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateMembershipParams,
    Awaited<ReturnType<typeof CreateMembership>>
  >(CreateMembership, options);
};
