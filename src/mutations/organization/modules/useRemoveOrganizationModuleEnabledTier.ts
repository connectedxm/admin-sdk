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
 * Removes an enabled tier from a specified organization module.
 * This function is used to delete a tier from an organization module by specifying the module type and tier ID.
 * It ensures that the relevant queries are invalidated to maintain data consistency.
 * @name RemoveOrganizationModuleEnabledTier
 * @param {keyof typeof OrganizationModuleType} moduleType (path) The type of the organization module
 * @param {string} tierId (path) The id of the tier to be removed
 * @version 1.3
 **/

export interface RemoveOrganizationModuleEnabledTierParams
  extends MutationParams {
  moduleType: keyof typeof OrganizationModuleType;
  tierId: string;
}

export const RemoveOrganizationModuleEnabledTier = async ({
  moduleType,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveOrganizationModuleEnabledTierParams): Promise<
  ConnectedXMResponse<OrganizationModule>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<
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
