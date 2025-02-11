import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, OrganizationMembership } from "@src/interfaces";
import { ORGANIZATION_USERS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to add a user to the organization.
 * This function allows administrators to add a new user to their organization by providing the user's email address.
 * It is designed to be used in applications where managing organization memberships is required.
 * @name AddOrganizationUser
 * @param {string} email (bodyValue) The email address of the user to be added
 * @version 1.3
 **/

export interface AddOrganizationUserParams extends MutationParams {
  email: string;
}

export const AddOrganizationUser = async ({
  email,
  adminApiParams,
  queryClient,
}: AddOrganizationUserParams): Promise<
  ConnectedXMResponse<OrganizationMembership>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
    ConnectedXMResponse<OrganizationMembership>
  >(`/organization/users`, { email });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ORGANIZATION_USERS_QUERY_KEY() });
  }
  return data;
};

export const useAddOrganizationUser = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddOrganizationUser>>,
      Omit<AddOrganizationUserParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddOrganizationUserParams,
    Awaited<ReturnType<typeof AddOrganizationUser>>
  >(AddOrganizationUser, options, {
    domain: "org",
    type: "update",
  });
};
