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
export interface UpdateOrganizationModuleParams extends MutationParams {
  module: OrganizationModuleUpdateInputs;
  moduleType: keyof typeof OrganizationModuleType;
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
}: UpdateOrganizationModuleParams): Promise<
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
export const useUpdateOrganizationModule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganizationModule>>,
      Omit<UpdateOrganizationModuleParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationModuleParams,
    Awaited<ReturnType<typeof UpdateOrganizationModule>>
  >(UpdateOrganizationModule, options);
};
