import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SponsorshipLevelTranslation } from "@src/interfaces";
import { LEVEL_QUERY_KEY } from "../useGetLevel";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";

/**
 * Retrieves translations for a specific sponsorship level.
 * This function fetches translation data for a given level ID, allowing applications to display localized information for sponsorship levels.
 * It is designed to be used in scenarios where multilingual support for sponsorship levels is required.
 * @name GetLevelTranslations
 * @param {string} levelId - The ID of the sponsorship level
 * @version 1.2
**/

export const LEVEL_TRANSLATIONS_QUERY_KEY = (levelId: string) => [
  ...LEVEL_QUERY_KEY(levelId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Levels
 */
export const SET_LEVEL_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof LEVEL_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLevelTranslations>>
) => {
  client.setQueryData(LEVEL_TRANSLATIONS_QUERY_KEY(...keyParams), response);
};

interface GetLevelTranslationsProps extends InfiniteQueryParams {
  levelId: string;
}

/**
 * @category Queries
 * @group Levels
 */
export const GetLevelTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  levelId,
  adminApiParams,
}: GetLevelTranslationsProps): Promise<
  ConnectedXMResponse<SponsorshipLevelTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/levels/${levelId}/translations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Levels
 */
export const useGetLevelTranslations = (
  levelId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetLevelTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetLevelTranslations>>
  >(
    LEVEL_TRANSLATIONS_QUERY_KEY(levelId),
    (params: InfiniteQueryParams) =>
      GetLevelTranslations({ levelId, ...params }),
    params,
    {
      ...options,
      enabled: !!levelId && (options.enabled ?? true),
    },
    "sponsors"
  );
};