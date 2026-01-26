import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  OrganizationModuleSettings,
  ConnectedXMResponse,
} from "@src/interfaces";
import { SET_ORGANIZATION_MODULE_SETTINGS_QUERY_DATA } from "@src/queries";
import { OrganizationModuleSettingsUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Organization-Module-Settings
 */
export interface UpdateOrganizationModuleSettingsParams extends MutationParams {
  settings: OrganizationModuleSettingsUpdateInputs;
}

/**
 * @category Methods
 * @group Organization-Module-Settings
 */
export const UpdateOrganizationModuleSettings = async ({
  settings,
  adminApiParams,
  queryClient,
}: UpdateOrganizationModuleSettingsParams): Promise<
  ConnectedXMResponse<OrganizationModuleSettings>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<OrganizationModuleSettings>
  >(`/organization/module-settings`, settings);
  if (queryClient && data.status === "ok") {
    SET_ORGANIZATION_MODULE_SETTINGS_QUERY_DATA(queryClient, [], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization-Module-Settings
 */
export const useUpdateOrganizationModuleSettings = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganizationModuleSettings>>,
      Omit<
        UpdateOrganizationModuleSettingsParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationModuleSettingsParams,
    Awaited<ReturnType<typeof UpdateOrganizationModuleSettings>>
  >(UpdateOrganizationModuleSettings, options);
};
