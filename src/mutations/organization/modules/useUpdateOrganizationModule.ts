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
 * Updates an organization module and invalidates related queries if necessary.
 * This function allows for updating the details of a specific organization module by its type.
 * It ensures that any related queries are invalidated to maintain data consistency.
 * @name UpdateOrganizationModule
 * @param {OrganizationModuleUpdateInputs} module (body) - The module data to update
 * @param {keyof typeof OrganizationModuleType} moduleType (path) - The type of the organization module
 * @version 1.3
 **/

export interface UpdateOrganizationModuleParams extends MutationParams {
  module: OrganizationModuleUpdateInputs;
  moduleType: keyof typeof OrganizationModuleType;
}

export const UpdateOrganizationModule = async ({
  module,
  moduleType,
  adminApiParams,
  queryClient,
}: UpdateOrganizationModuleParams): Promise<
  ConnectedXMResponse<OrganizationModule>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<OrganizationModule>>(
    `/organization/modules/${moduleType}`,
    module
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_MODULES_QUERY_KEY(),
    });
  }
  return data;
};

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