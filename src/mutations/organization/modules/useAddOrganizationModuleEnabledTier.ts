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
 * Adds an enabled tier to a specific organization module.
 * This function allows the addition of a tier to an organization module, enabling specific functionalities or features associated with that tier.
 * It is intended for use in administrative contexts where organization modules need to be configured with specific tiers.
 * @name AddOrganizationModuleEnabledTier
 * @param {keyof typeof OrganizationModuleType} moduleType (path) - The type of the organization module
 * @param {string} tierId (path) - The id of the tier to be enabled
 * @version 1.3
 **/

export interface AddOrganizationModuleEnabledTierParams extends MutationParams {
  moduleType: keyof typeof OrganizationModuleType;
  tierId: string;
}

export const AddOrganizationModuleEnabledTier = async ({
  moduleType,
  tierId,
  adminApiParams,
  queryClient,
}: AddOrganizationModuleEnabledTierParams): Promise<
  ConnectedXMResponse<OrganizationModule>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<OrganizationModule>>(
    `/organization/modules/${moduleType}/enabledTiers/${tierId}`
  );

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