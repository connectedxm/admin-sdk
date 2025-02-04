import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, OrganizationMembership } from "@src/interfaces";
import { ORGANIZATION_USERS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Organization
 */
export interface AddOrganizationUserParams extends MutationParams {
  email: string;
}

/**
 * @category Methods
 * @group Organization
 */
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

/**
 * @category Mutations
 * @group Organization
 */
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
