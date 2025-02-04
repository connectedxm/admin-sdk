import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, DomainDetails } from "@src/interfaces";
import { SET_ORGANIZATION_DOMAIN_QUERY_DATA } from "@src/queries/organization/useGetOrganizationDomain";

/**
 * @category Params
 * @group Organization
 */
export interface UpdateOrganizationDomainParams extends MutationParams {
  domain: string;
}

/**
 * @category Methods
 * @group Organization
 */
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

/**
 * @category Mutations
 * @group Organization
 */
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
