import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { OrganizationModuleSettings } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Organization-Module-Settings
 */
export const ORGANIZATION_MODULE_SETTINGS_QUERY_KEY = () => [
  "ORGANIZATION",
  "MODULE_SETTINGS",
];

/**
 * @category Setters
 * @group Organization-Module-Settings
 */
export const SET_ORGANIZATION_MODULE_SETTINGS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_MODULE_SETTINGS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationModuleSettings>>
) => {
  client.setQueryData(
    ORGANIZATION_MODULE_SETTINGS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationModuleSettingsProps extends SingleQueryParams {}

/**
 * @category Queries
 * @group Organization-Module-Settings
 */
export const GetOrganizationModuleSettings = async ({
  adminApiParams,
}: GetOrganizationModuleSettingsProps): Promise<
  ConnectedXMResponse<OrganizationModuleSettings>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/module-settings`);
  return data;
};

/**
 * @category Hooks
 * @group Organization-Module-Settings
 */
export const useGetOrganizationModuleSettings = (
  options: SingleQueryOptions<
    ReturnType<typeof GetOrganizationModuleSettings>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetOrganizationModuleSettings>
  >(
    ORGANIZATION_MODULE_SETTINGS_QUERY_KEY(),
    (params: SingleQueryParams) => GetOrganizationModuleSettings(params),
    options
  );
};
