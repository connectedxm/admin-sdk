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
 * Removes an editable tier from a specified organization module.
 * This function is used to delete a tier from an organization module, identified by its type and tier ID.
 * It ensures that the specified tier is removed and updates the relevant queries to reflect this change.
 * @name RemoveOrganizationModuleEditableTier
 * @param {keyof typeof OrganizationModuleType} moduleType (path) The type of the organization module
 * @param {string} tierId (path) The id of the tier to be removed
 * @version 1.3
 **/

export interface RemoveOrganizationModuleEditableTierParams
  extends MutationParams {
  moduleType: keyof typeof OrganizationModuleType;
  tierId: string;
}

export const RemoveOrganizationModuleEditableTier = async ({
  moduleType,
  tierId,
  adminApiParams,
  queryClient,
}: RemoveOrganizationModuleEditableTierParams): Promise<
  ConnectedXMResponse<OrganizationModule>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<
    ConnectedXMResponse<OrganizationModule>
  >(`/organization/modules/${moduleType}/editableTiers/${tierId}`);

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

export const useRemoveOrganizationModuleEditableTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveOrganizationModuleEditableTier>>,
      Omit<
        RemoveOrganizationModuleEditableTierParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveOrganizationModuleEditableTierParams,
    Awaited<ReturnType<typeof RemoveOrganizationModuleEditableTier>>
  >(RemoveOrganizationModuleEditableTier, options);
};
