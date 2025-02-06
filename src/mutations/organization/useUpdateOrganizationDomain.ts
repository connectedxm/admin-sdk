import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, DomainDetails } from "@src/interfaces";
import { SET_ORGANIZATION_DOMAIN_QUERY_DATA } from "@src/queries/organization/useGetOrganizationDomain";

/**
 * Endpoint to update the organization's domain.
 * This function allows updating the domain associated with an organization.
 * It is designed to be used in applications where managing organization settings is required.
 * @name UpdateOrganizationDomain
 * @param {string} domain (bodyValue) - The new domain for the organization
 * @version 1.3
 **/

export interface UpdateOrganizationDomainParams extends MutationParams {
  domain: string;
}

export const UpdateOrganizationDomain = async ({
  domain,
  adminApiParams,
  queryClient,
}: UpdateOrganizationDomainParams): Promise<
  ConnectedXMResponse<DomainDetails>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<DomainDetails>>(
    `/organization/domain`,
    { domain }
  );
  if (queryClient && data.status === "ok") {
    SET_ORGANIZATION_DOMAIN_QUERY_DATA(queryClient, [], data);
  }
  return data;
};

export const useUpdateOrganizationDomain = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganizationDomain>>,
      Omit<UpdateOrganizationDomainParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationDomainParams,
    Awaited<ReturnType<typeof UpdateOrganizationDomain>>
  >(UpdateOrganizationDomain, options, {
    domain: "org",
    type: "update",
  });
};