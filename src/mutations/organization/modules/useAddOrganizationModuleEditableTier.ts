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
export interface AddOrganizationModuleEditableTierParams
  extends MutationParams {
  moduleType: keyof typeof OrganizationModuleType;
  tierId: string;
}

/**
 * @category Methods
 * @group Organization
 */
export const AddOrganizationModuleEditableTier = async ({
  moduleType,
  tierId,
  adminApiParams,
  queryClient,
}: AddOrganizationModuleEditableTierParams): Promise<
  ConnectedXMResponse<OrganizationModule>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
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
