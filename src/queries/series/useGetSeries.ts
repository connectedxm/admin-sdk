import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Series } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { SERIES_LIST_QUERY_KEY } from "./useGetSeriesList";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_QUERY_KEY = (seriesId: string) => [
  ...SERIES_LIST_QUERY_KEY(),
  seriesId,
];

/**
 * @category Setters
 * @group Series
 */
export const SET_SERIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SERIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeries>>
) => {
  client.setQueryData(SERIES_QUERY_KEY(...keyParams), response);
};

interface GetSeriesProps extends SingleQueryParams {
  seriesId: string;
}

/**
 * @category Queries
 * @group Series
 */
export const GetSeries = async ({
  seriesId,
  adminApiParams,
}: GetSeriesProps): Promise<ConnectedXMResponse<Series>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/series/${seriesId}`);
  return data;
};
/**
 * @category Hooks
 * @group Series
 */
export const useGetSeries = (
  seriesId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSeries>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSeries>>(
    SERIES_QUERY_KEY(seriesId),
    (params: SingleQueryParams) => GetSeries({ seriesId, ...params }),
    {
      ...options,
      enabled: !!seriesId && (options?.enabled ?? true),
    }
  );
};
