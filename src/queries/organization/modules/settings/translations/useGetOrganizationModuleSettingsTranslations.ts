import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { OrganizationModuleSettingsTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../../useConnectedInfiniteQuery";
import { ORGANIZATION_MODULE_SETTINGS_QUERY_KEY } from "../useGetOrganizationModuleSettings";

/**
 * @category Keys
 * @group Organization-Module-Settings
 */
export const ORGANIZATION_MODULE_SETTINGS_TRANSLATIONS_QUERY_KEY = () => [
  ...ORGANIZATION_MODULE_SETTINGS_QUERY_KEY(),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Organization-Module-Settings
 */
export const SET_ORGANIZATION_MODULE_SETTINGS_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<
    typeof ORGANIZATION_MODULE_SETTINGS_TRANSLATIONS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetOrganizationModuleSettingsTranslations>
  >
) => {
  client.setQueryData(
    ORGANIZATION_MODULE_SETTINGS_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationModuleSettingsTranslationsProps
  extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Organization-Module-Settings
 */
export const GetOrganizationModuleSettingsTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetOrganizationModuleSettingsTranslationsProps): Promise<
  ConnectedXMResponse<OrganizationModuleSettingsTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/module-settings/translations`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

/**
 * @category Hooks
 * @group Organization-Module-Settings
 */
export const useGetOrganizationModuleSettingsTranslations = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetOrganizationModuleSettingsTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetOrganizationModuleSettingsTranslations>>
  >(
    ORGANIZATION_MODULE_SETTINGS_TRANSLATIONS_QUERY_KEY(),
    (params: InfiniteQueryParams) =>
      GetOrganizationModuleSettingsTranslations({
        ...params,
      }),
    params,
    options
  );
};
