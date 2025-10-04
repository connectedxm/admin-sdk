import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Organization, ConnectedXMResponse } from "@src/interfaces";
import { SET_ORGANIZATION_QUERY_DATA } from "@src/queries";
import { OrganizationUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Organization
 */
export interface UpdateOrganizationParams extends MutationParams {
  organization: OrganizationUpdateInputs;
}

/**
 * @category Methods
 * @group Organization
 */
export const UpdateOrganization = async ({
  organization,
  adminApiParams,
  queryClient,
}: UpdateOrganizationParams): Promise<ConnectedXMResponse<Organization>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Organization>>(
    `/organization`,
    organization
  );
  if (queryClient && data.status === "ok") {
    SET_ORGANIZATION_QUERY_DATA(queryClient, [], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useUpdateOrganization = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganization>>,
      Omit<UpdateOrganizationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationParams,
    Awaited<ReturnType<typeof UpdateOrganization>>
  >(UpdateOrganization, options);
};
