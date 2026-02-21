import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SeriesQuestionChoice } from "@src/interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SERIES_QUESTION_QUERY_KEY } from "./useGetSeriesQuestion";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_QUESTION_CHOICES_QUERY_KEY = (
  seriesId: string,
  questionId: string
) => [...SERIES_QUESTION_QUERY_KEY(seriesId, questionId), "CHOICES"];

/**
 * @category Setters
 * @group Series
 */
export const SET_SERIES_QUESTION_CHOICES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SERIES_QUESTION_CHOICES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesQuestionChoices>>
) => {
  client.setQueryData(
    [
      ...SERIES_QUESTION_CHOICES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(""),
    ],
    {
      pages: [response],
      pageParams: [null],
    }
  );
};

interface GetSeriesQuestionChoicesProps extends InfiniteQueryParams {
  seriesId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Series
 */
export const GetSeriesQuestionChoices = async ({
  seriesId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSeriesQuestionChoicesProps): Promise<
  ConnectedXMResponse<SeriesQuestionChoice[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/series/${seriesId}/questions/${questionId}/choices`,
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
 * @group Series
 */
export const useGetSeriesQuestionChoices = (
  seriesId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSeriesQuestionChoices>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSeriesQuestionChoices>>
  >(
    SERIES_QUESTION_CHOICES_QUERY_KEY(seriesId, questionId),
    (queryParams: InfiniteQueryParams) =>
      GetSeriesQuestionChoices({
        ...queryParams,
        seriesId,
        questionId,
      }),
    params,
    {
      ...options,
      enabled: !!seriesId && !!questionId && (options.enabled ?? true),
    }
  );
};
