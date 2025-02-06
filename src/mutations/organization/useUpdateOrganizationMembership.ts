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
 * Endpoint to update a user's organization membership.
 * This function allows updating the membership details of a user within an organization.
 * It is designed to be used in applications where user membership management is required.
 * @name UpdateOrganizationMembership
 * @param {string} userId (path) - The id of the user
 * @param {OrganizationMembershipUpdateInputs} membership (body) - The membership details to update
 * @version 1.3
 **/
export interface UpdateOrganizationMembershipParams extends MutationParams {
  userId: string;
  membership: OrganizationMembershipUpdateInputs;
}

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