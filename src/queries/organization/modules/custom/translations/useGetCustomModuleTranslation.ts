import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { CustomModuleTranslation } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { CUSTOM_MODULE_TRANSLATIONS_QUERY_KEY } from "./useGetCustomModuleTranslations";

/**
 * @category Keys
 * @group Organization
 */
export const CUSTOM_MODULE_TRANSLATION_QUERY_KEY = (
  moduleId: string,
  locale: string
) => [...CUSTOM_MODULE_TRANSLATIONS_QUERY_KEY(moduleId), locale];

/**
 * @category Setters
 * @group Organization
 */
export const SET_CUSTOM_MODULE_TRANSLATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CUSTOM_MODULE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCustomModuleTranslation>>
) => {
  client.setQueryData(
    CUSTOM_MODULE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetCustomModuleTranslationProps extends SingleQueryParams {
  moduleId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetCustomModuleTranslation = async ({
  moduleId,
  locale,
  adminApiParams,
}: GetCustomModuleTranslationProps): Promise<
  ConnectedXMResponse<CustomModuleTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/modules/custom/${moduleId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Organization
 */
export const useGetCustomModuleTranslation = (
  moduleId: string,
  locale: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetCustomModuleTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetCustomModuleTranslation>>(
    CUSTOM_MODULE_TRANSLATION_QUERY_KEY(moduleId, locale),
    (params: SingleQueryParams) =>
      GetCustomModuleTranslation({ moduleId, locale, ...params }),
    {
      ...options,
      enabled: !!moduleId && !!locale && (options?.enabled ?? true),
    }
  );
};
