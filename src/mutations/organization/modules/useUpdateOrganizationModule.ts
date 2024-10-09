import { GetAdminAPI } from "@src/AdminAPI";

import {
  ConnectedXMResponse,
  OrganizationModule,
  OrganizationModuleType,
} from "@src/interfaces";
import { ORGANIZATION_MODULES_QUERY_KEY } from "@src/queries";
import { OrganizationModuleUpdateInputs } from "@src/params";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";

/**
 * @category Params
 * @group Organization
 */
export interface UpdateOrganizationModulesParams extends MutationParams {
  module: OrganizationModuleUpdateInputs;
  moduleType: OrganizationModuleType;
}

/**
 * @category Methods
 * @group Organization
 */
export const UpdateOrganizationModule = async ({
  module,
  moduleType,
  adminApiParams,
  queryClient,
}: UpdateOrganizationModulesParams): Promise<
  ConnectedXMResponse<OrganizationModule>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<OrganizationModule>
  >(`/organization/modules/${moduleType}`, {
    module,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_MODULES_QUERY_KEY(),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useUpdateOrganizationModules = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganizationModule>>,
      Omit<UpdateOrganizationModulesParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationModulesParams,
    Awaited<ReturnType<typeof UpdateOrganizationModule>>
  >(UpdateOrganizationModule, options);
};
