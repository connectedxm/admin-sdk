import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SeriesQuestion } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SERIES_QUERY_KEY } from "../useGetSeries";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_QUESTIONS_QUERY_KEY = (seriesId: string) => [
  ...SERIES_QUERY_KEY(seriesId),
  "QUESTIONS",
];

/**
 * @category Setters
 * @group Series
 */
export const SET_SERIES_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SERIES_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesQuestions>>
) => {
  client.setQueryData(SERIES_QUESTIONS_QUERY_KEY(...keyParams), response);
};

interface GetSeriesQuestionsProps extends InfiniteQueryParams {
  seriesId: string;
}

/**
 * @category Queries
 * @group Series
 */
export const GetSeriesQuestions = async ({
  seriesId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSeriesQuestionsProps): Promise<
  ConnectedXMResponse<SeriesQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/series/${seriesId}/questions`, {
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
export const useGetSeriesQuestions = (
  seriesId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSeriesQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSeriesQuestions>>
  >(
    SERIES_QUESTIONS_QUERY_KEY(seriesId),
    (queryParams: InfiniteQueryParams) =>
      GetSeriesQuestions({
        ...queryParams,
        seriesId,
      }),
    params,
    {
      ...options,
      enabled: !!seriesId && (options.enabled ?? true),
    }
  );
};
