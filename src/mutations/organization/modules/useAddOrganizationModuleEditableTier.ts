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
 * Adds an editable tier to a specified organization module.
 * This function allows the addition of a new tier to an organization module, making it editable.
 * It is intended for use in scenarios where organizations need to manage and customize their module tiers.
 * @name AddOrganizationModuleEditableTier
 * @param {keyof typeof OrganizationModuleType} moduleType - The type of the organization module
 * @param {string} tierId - The id of the tier
 * @version 1.2
 **/

export interface AddOrganizationModuleEditableTierParams extends MutationParams {
  moduleType: keyof typeof OrganizationModuleType;
  tierId: string;
}

export const AddOrganizationModuleEditableTier = async ({
  moduleType,
  tierId,
  adminApiParams,
  queryClient,
}: AddOrganizationModuleEditableTierParams): Promise<ConnectedXMResponse<OrganizationModule>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<OrganizationModule>>(
    `/organization/modules/${moduleType}/editableTiers/${tierId}`
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

export const useAddOrganizationModuleEditableTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddOrganizationModuleEditableTier>>,
      Omit<
        AddOrganizationModuleEditableTierParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddOrganizationModuleEditableTierParams,
    Awaited<ReturnType<typeof AddOrganizationModuleEditableTier>>
  >(AddOrganizationModuleEditableTier, options);
};