import { ConnectedXMResponse } from "@src/interfaces";
import { SponsorshipLevelTranslation } from "@src/interfaces";
import { LEVEL_TRANSLATIONS_QUERY_KEY } from "./useGetLevelTranslations";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedSingleQuery,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";

/**
 * @category Keys
 * @group Levels
 */
export const LEVEL_TRANSLATION_QUERY_KEY = (
  levelId: string,
  locale: string
) => [...LEVEL_TRANSLATIONS_QUERY_KEY(levelId), locale];

/**
 * @category Setters
 * @group Levels
 */
export const SET_LEVEL_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof LEVEL_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLevelTranslation>>
) => {
  client.setQueryData(LEVEL_TRANSLATION_QUERY_KEY(...keyParams), response);
};

interface GetLevelTranslationProps extends SingleQueryParams {
  levelId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Levels
 */
export const GetLevelTranslation = async ({
  levelId,
  locale,
  adminApiParams,
}: GetLevelTranslationProps): Promise<
  ConnectedXMResponse<SponsorshipLevelTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/levels/${levelId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Levels
 */
export const useGetLevelTranslation = (
  levelId: string = "",
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetLevelTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetLevelTranslation>>(
    LEVEL_TRANSLATION_QUERY_KEY(levelId, locale),
    (params) =>
      GetLevelTranslation({
        ...params,
        levelId,
        locale,
      }),
    {
      ...options,
      enabled:
        !!levelId && !!locale && locale !== "en" && (options.enabled ?? true),
    },
    "sponsors"
  );
};
