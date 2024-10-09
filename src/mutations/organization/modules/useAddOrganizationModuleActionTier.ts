import { GetAdminAPI } from "@src/AdminAPI";

import {
  ConnectedXMResponse,
  OrganizationActionType,
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
export interface AddOrganizationModuleActionTierParams extends MutationParams {
  moduleType: OrganizationModuleType;
  actionType: OrganizationActionType;
  tierId: string;
}

/**
 * @category Methods
 * @group Organization
 */
export const AddOrganizationModuleActionTier = async ({
  moduleType,
  actionType,
  tierId,
  adminApiParams,
  queryClient,
}: AddOrganizationModuleActionTierParams): Promise<
  ConnectedXMResponse<OrganizationModule>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<OrganizationModule>
  >(
    `/organization/modules/${moduleType}/actions/${actionType}/tiers/${tierId}`
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

/**
 * @category Mutations
 * @group Organization
 */
export const useAddOrganizationModuleActionTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddOrganizationModuleActionTier>>,
      Omit<
        AddOrganizationModuleActionTierParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddOrganizationModuleActionTierParams,
    Awaited<ReturnType<typeof AddOrganizationModuleActionTier>>
  >(AddOrganizationModuleActionTier, options);
};
