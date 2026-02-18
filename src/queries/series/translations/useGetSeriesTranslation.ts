import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SeriesTranslation } from "@src/interfaces";
import { SERIES_TRANSLATIONS_QUERY_KEY } from "./useGetSeriesTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_TRANSLATION_QUERY_KEY = (seriesId: string, locale: string) =>
  [...SERIES_TRANSLATIONS_QUERY_KEY(seriesId), locale];

/**
 * @category Setters
 * @group Series
 */
export const SET_SERIES_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SERIES_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesTranslation>>
) => {
  client.setQueryData(SERIES_TRANSLATION_QUERY_KEY(...keyParams), response);
};

interface GetSeriesTranslationProps extends SingleQueryParams {
  seriesId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Series
 */
export const GetSeriesTranslation = async ({
  seriesId,
  locale,
  adminApiParams,
}: GetSeriesTranslationProps): Promise<
  ConnectedXMResponse<SeriesTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/series/${seriesId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Series
 */
export const useGetSeriesTranslation = (
  seriesId: string = "",
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSeriesTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSeriesTranslation>>(
    SERIES_TRANSLATION_QUERY_KEY(seriesId, locale),
    (params: SingleQueryParams) =>
      GetSeriesTranslation({
        seriesId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!seriesId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    }
  );
};
