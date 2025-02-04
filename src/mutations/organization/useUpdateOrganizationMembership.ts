import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { OrganizationMembership, ConnectedXMResponse } from "@src/interfaces";
import {
  ORGANIZATION_USERS_QUERY_KEY,
  SELF_MEMBERSHIP_QUERY_KEY,
  SET_ORGANIZATION_MEMBERSHIP_QUERY_DATA,
} from "@src/queries";
import { OrganizationMembershipUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Organization
 */
export interface UpdateOrganizationMembershipParams extends MutationParams {
  userId: string;
  membership: OrganizationMembershipUpdateInputs;
}

/**
 * @category Methods
 * @group Organization
 */
export const UpdateOrganizationMembership = async ({
  userId,
  membership,
  adminApiParams,
  queryClient,
}: UpdateOrganizationMembershipParams): Promise<
  ConnectedXMResponse<OrganizationMembership>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<
    ConnectedXMResponse<OrganizationMembership>
  >(`/organization/users/${userId}`, membership);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ORGANIZATION_USERS_QUERY_KEY() });
    queryClient.invalidateQueries({ queryKey: SELF_MEMBERSHIP_QUERY_KEY() });
    SET_ORGANIZATION_MEMBERSHIP_QUERY_DATA(queryClient, [userId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useUpdateOrganizationMembership = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganizationMembership>>,
      Omit<UpdateOrganizationMembershipParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationMembershipParams,
    Awaited<ReturnType<typeof UpdateOrganizationMembership>>
  >(UpdateOrganizationMembership, options, {
    domain: "org",
    type: "update",
  });
};
