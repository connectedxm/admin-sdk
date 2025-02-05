import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { SET_ORGANIZATION_DOMAIN_QUERY_DATA } from "@src/queries/organization/useGetOrganizationDomain";

/**
 * Endpoint to delete an organization domain.
 * This function allows for the removal of a domain associated with an organization.
 * It is intended for use in administrative contexts where domain management is required.
 * @name DeleteOrganizationDomain
 * @version 1.2
 **/

export interface DeleteOrganizationDomainParams extends MutationParams {}

export const DeleteOrganizationDomain = async ({
  adminApiParams,
  queryClient,
}: DeleteOrganizationDomainParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/organization/domain`
  );
  if (queryClient && data.status === "ok") {
    SET_ORGANIZATION_DOMAIN_QUERY_DATA(queryClient, [], data);
  }
  return data;
};

export const useDeleteOrganizationDomain = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteOrganizationDomain>>,
      Omit<DeleteOrganizationDomainParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteOrganizationDomainParams,
    Awaited<ReturnType<typeof DeleteOrganizationDomain>>
  >(DeleteOrganizationDomain, options, {
    domain: "org",
    type: "update",
  });
};