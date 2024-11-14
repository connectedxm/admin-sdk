import { GetAdminAPI } from "@src/AdminAPI";

import {
  ConnectedXMResponse,
  OrganizationModule,
  OrganizationModuleType,
} from "@src/interfaces";
import {
  ORGANIZATION_MODULE_QUERY_KEY,
  ORGANIZATION_MODULES_QUERY_KEY,
} from "@src/queries";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";

/**
 * @category Params
 * @group Organization
 */
export interface AddOrganizationModuleEnabledTierParams extends MutationParams {
  moduleType: OrganizationModuleType;
  tierId: string;
}

/**
 * @category Methods
 * @group Organization
 */
export const AddOrganizationModuleEnabledTier = async ({
  moduleType,
  tierId,
  adminApiParams,
  queryClient,
}: AddOrganizationModuleEnabledTierParams): Promise<
  ConnectedXMResponse<OrganizationModule>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<OrganizationModule>
  >(`/organization/modules/${moduleType}/enabledTiers/${tierId}`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_MODULES_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_MODULE_QUERY_KEY(moduleType),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useAddOrganizationModuleEnabledTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddOrganizationModuleEnabledTier>>,
      Omit<
        AddOrganizationModuleEnabledTierParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddOrganizationModuleEnabledTierParams,
    Awaited<ReturnType<typeof AddOrganizationModuleEnabledTier>>
  >(AddOrganizationModuleEnabledTier, options);
};
