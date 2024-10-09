import { GetAdminAPI } from "@src/AdminAPI";

import {
  ConnectedXMResponse,
  OrganizationModule,
  OrganizationModuleType,
} from "@src/interfaces";
import { ORGANIZATION_MODULES_QUERY_KEY } from "@src/queries";
import { OrganizationModuleActionUpdateInputs } from "@src/params";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";

/**
 * @category Params
 * @group Organization
 */
export interface UpdateOrganizationModuleActionsParams extends MutationParams {
  moduleType: OrganizationModuleType;
  moduleActions: OrganizationModuleActionUpdateInputs[];
}

/**
 * @category Methods
 * @group Organization
 */
export const UpdateOrganizationModuleActions = async ({
  moduleType,
  moduleActions,
  adminApiParams,
  queryClient,
}: UpdateOrganizationModuleActionsParams): Promise<
  ConnectedXMResponse<OrganizationModule>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<OrganizationModule>
  >(`/organization/modules/${moduleType}/actions`, {
    moduleActions,
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
export const useUpdateOrganizationModuleActions = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganizationModuleActions>>,
      Omit<
        UpdateOrganizationModuleActionsParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationModuleActionsParams,
    Awaited<ReturnType<typeof UpdateOrganizationModuleActions>>
  >(UpdateOrganizationModuleActions, options);
};
