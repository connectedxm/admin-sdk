import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, SeriesQuestion } from "@src/interfaces";
import { SERIES_QUESTIONS_QUERY_KEY } from "./useGetSeriesQuestions";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_QUESTION_QUERY_KEY = (
  seriesId: string,
  questionId: string
) => [...SERIES_QUESTIONS_QUERY_KEY(seriesId), questionId];

/**
 * @category Setters
 * @group Series
 */
export const SET_SERIES_QUESTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SERIES_QUESTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesQuestion>>
) => {
  client.setQueryData(SERIES_QUESTION_QUERY_KEY(...keyParams), response);
};

interface GetSeriesQuestionProps extends SingleQueryParams {
  seriesId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Series
 */
export const GetSeriesQuestion = async ({
  seriesId,
  questionId,
  adminApiParams,
}: GetSeriesQuestionProps): Promise<
  ConnectedXMResponse<SeriesQuestion>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/series/${seriesId}/questions/${questionId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Series
 */
export const useGetSeriesQuestion = (
  seriesId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSeriesQuestion>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSeriesQuestion>>(
    SERIES_QUESTION_QUERY_KEY(seriesId, questionId),
    (params: SingleQueryParams) =>
      GetSeriesQuestion({ seriesId, questionId, ...params }),
    {
      ...options,
      enabled: !!seriesId && !!questionId && (options?.enabled ?? true),
    }
  );
};
