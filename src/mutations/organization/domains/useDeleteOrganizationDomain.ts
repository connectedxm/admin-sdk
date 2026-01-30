import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { SET_ORGANIZATION_DOMAIN_QUERY_DATA } from "@src/queries/organization/domains/useGetOrganizationDomain";

/**
 * @category Params
 * @group Organization
 */
export interface DeleteOrganizationDomainParams extends MutationParams {}

/**
 * @category Methods
 * @group Organization
 */
export const DeleteOrganizationDomain = async ({
  adminApiParams,
  queryClient,
}: DeleteOrganizationDomainParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/organization/domain`
  );
  if (queryClient && data.status === "ok") {
    SET_ORGANIZATION_DOMAIN_QUERY_DATA(queryClient, [], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
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
  >(DeleteOrganizationDomain, options);
};
