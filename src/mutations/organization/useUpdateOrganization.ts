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
 * Endpoint to update the details of an organization.
 * This function allows for updating the information of an organization using the provided organization details.
 * It is designed to be used in applications where organization data needs to be modified.
 * @name UpdateOrganization
 * @param {OrganizationUpdateInputs} organization (body) - The organization details to update
 * @version 1.3
 **/
export interface UpdateOrganizationParams extends MutationParams {
  organization: OrganizationUpdateInputs;
}

export const UpdateOrganization = async ({
  organization,
  adminApiParams,
  queryClient,
}: UpdateOrganizationParams): Promise<ConnectedXMResponse<Organization>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Organization>>(
    `/organization`,
    organization
  );
  if (queryClient && data.status === "ok") {
    SET_ORGANIZATION_QUERY_DATA(queryClient, [], data);
  }
  return data;
};

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
  >(UpdateOrganization, options, {
    domain: "org",
    type: "update",
  });
};