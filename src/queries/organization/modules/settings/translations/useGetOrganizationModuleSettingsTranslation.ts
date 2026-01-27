import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { OrganizationModuleSettingsTranslation } from "@src/interfaces";
import { ORGANIZATION_MODULE_SETTINGS_TRANSLATIONS_QUERY_KEY } from "./useGetOrganizationModuleSettingsTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Organization-Module-Settings
 */
export const ORGANIZATION_MODULE_SETTINGS_TRANSLATION_QUERY_KEY = (
  locale: string
) => [...ORGANIZATION_MODULE_SETTINGS_TRANSLATIONS_QUERY_KEY(), locale];

/**
 * @category Setters
 * @group Organization-Module-Settings
 */
export const SET_ORGANIZATION_MODULE_SETTINGS_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<
    typeof ORGANIZATION_MODULE_SETTINGS_TRANSLATION_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetOrganizationModuleSettingsTranslation>>
) => {
  client.setQueryData(
    ORGANIZATION_MODULE_SETTINGS_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationModuleSettingsTranslationProps
  extends SingleQueryParams {
  locale: string;
}

/**
 * @category Queries
 * @group Organization-Module-Settings
 */
export const GetOrganizationModuleSettingsTranslation = async ({
  locale,
  adminApiParams,
}: GetOrganizationModuleSettingsTranslationProps): Promise<
  ConnectedXMResponse<OrganizationModuleSettingsTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/module-settings/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Organization-Module-Settings
 */
export const useGetOrganizationModuleSettingsTranslation = (
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetOrganizationModuleSettingsTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetOrganizationModuleSettingsTranslation>
  >(
    ORGANIZATION_MODULE_SETTINGS_TRANSLATION_QUERY_KEY(locale),
    (params: SingleQueryParams) =>
      GetOrganizationModuleSettingsTranslation({
        ...params,
        locale,
      }),
    {
      ...options,
      enabled: !!locale && locale !== "en" && (options.enabled ?? true),
    }
  );
};
