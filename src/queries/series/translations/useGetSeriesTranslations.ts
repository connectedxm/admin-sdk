import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SeriesTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SERIES_QUERY_KEY } from "../useGetSeries";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_TRANSLATIONS_QUERY_KEY = (seriesId: string) => [
  ...SERIES_QUERY_KEY(seriesId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Series
 */
export const SET_SERIES_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SERIES_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesTranslations>>
) => {
  client.setQueryData(SERIES_TRANSLATIONS_QUERY_KEY(...keyParams), response);
};

interface GetSeriesTranslationsProps extends InfiniteQueryParams {
  seriesId: string;
}

/**
 * @category Queries
 * @group Series
 */
export const GetSeriesTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  seriesId,
  adminApiParams,
}: GetSeriesTranslationsProps): Promise<
  ConnectedXMResponse<SeriesTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/series/${seriesId}/translations`, {
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
 * @group Series
 */
export const useGetSeriesTranslations = (
  seriesId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSeriesTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSeriesTranslations>>
  >(
    SERIES_TRANSLATIONS_QUERY_KEY(seriesId),
    (params: InfiniteQueryParams) =>
      GetSeriesTranslations({
        ...params,
        seriesId,
      }),
    params,
    {
      ...options,
      enabled: !!seriesId && (options.enabled ?? true),
    }
  );
};
