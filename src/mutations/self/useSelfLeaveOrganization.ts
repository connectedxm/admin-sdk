import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, User } from "@src/interfaces";
import {
  SELF_ORGANIZATIONS_QUERY_KEY,
  SET_SELF_QUERY_DATA,
} from "@src/queries";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "../useConnectedMutation";

/**
 * Endpoint to allow a user to leave an organization they are part of.
 * This function facilitates the removal of a user from an organization by deleting their association with it.
 * It is intended for use in applications where users need the ability to manage their organizational memberships.
 * @name DeleteSelfOrganizations
 * @param {string} organizationId - The ID of the organization
 * @version 1.2
 **/

export interface SelfLeaveOrganizationParams extends MutationParams {
  organizationId: string;
}

export const SelfLeaveOrganization = async ({
  organizationId,
  adminApiParams,
  queryClient,
}: SelfLeaveOrganizationParams): Promise<ConnectedXMResponse<User>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<User>>(
    `/self/organizations/${organizationId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_ORGANIZATIONS_QUERY_KEY() });
    SET_SELF_QUERY_DATA(queryClient, [], data);
  }
  return data;
};

export const useSelfLeaveOrganization = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof SelfLeaveOrganization>>,
      Omit<SelfLeaveOrganizationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelfLeaveOrganizationParams,
    Awaited<ReturnType<typeof SelfLeaveOrganization>>
  >(SelfLeaveOrganization, options);
};