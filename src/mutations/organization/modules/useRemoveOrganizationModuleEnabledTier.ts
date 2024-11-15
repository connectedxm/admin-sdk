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
export interface RemoveOrganizationModuleEnabledTierParams
  extends MutationParams {
  moduleType: keyof typeof OrganizationModuleType;
  tierId: string;
}

/**
 * @category Methods
 * @group Organization
 */
export const RemoveOrganizationModuleEnabledTier = async ({
  moduleType,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveOrganizationModuleEnabledTierParams): Promise<
  ConnectedXMResponse<OrganizationModule>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
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
export const useRemoveOrganizationModuleEnabledTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveOrganizationModuleEnabledTier>>,
      Omit<
        RemoveOrganizationModuleEnabledTierParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveOrganizationModuleEnabledTierParams,
    Awaited<ReturnType<typeof RemoveOrganizationModuleEnabledTier>>
  >(RemoveOrganizationModuleEnabledTier, options);
};
