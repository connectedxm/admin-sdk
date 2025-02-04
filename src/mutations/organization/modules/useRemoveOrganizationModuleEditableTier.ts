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
export interface RemoveOrganizationModuleEditableTierParams
  extends MutationParams {
  moduleType: keyof typeof OrganizationModuleType;
  tierId: string;
}

/**
 * @category Methods
 * @group Organization
 */
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

/**
 * @category Mutations
 * @group Organization
 */
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
