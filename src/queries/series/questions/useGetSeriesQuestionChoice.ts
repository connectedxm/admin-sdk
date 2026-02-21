import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, SeriesQuestionChoice } from "@src/interfaces";
import { SERIES_QUESTION_CHOICES_QUERY_KEY } from "./useGetSeriesQuestionChoices";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_QUESTION_CHOICE_QUERY_KEY = (
  seriesId: string,
  questionId: string,
  choiceId: string
) => [...SERIES_QUESTION_CHOICES_QUERY_KEY(seriesId, questionId), choiceId];

/**
 * @category Setters
 * @group Series
 */
export const SET_SERIES_QUESTION_CHOICE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SERIES_QUESTION_CHOICE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesQuestionChoice>>
) => {
  client.setQueryData(SERIES_QUESTION_CHOICE_QUERY_KEY(...keyParams), response);
};

interface GetSeriesQuestionChoiceProps extends SingleQueryParams {
  seriesId: string;
  questionId: string;
  choiceId: string;
}

/**
 * @category Queries
 * @group Series
 */
export const GetSeriesQuestionChoice = async ({
  seriesId,
  questionId,
  choiceId,
  adminApiParams,
}: GetSeriesQuestionChoiceProps): Promise<
  ConnectedXMResponse<SeriesQuestionChoice>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/series/${seriesId}/questions/${questionId}/choices/${choiceId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Series
 */
export const useGetSeriesQuestionChoice = (
  seriesId: string,
  questionId: string,
  choiceId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSeriesQuestionChoice>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSeriesQuestionChoice>>(
    SERIES_QUESTION_CHOICE_QUERY_KEY(seriesId, questionId, choiceId),
    (params: SingleQueryParams) =>
      GetSeriesQuestionChoice({ seriesId, questionId, choiceId, ...params }),
    {
      ...options,
      enabled:
        !!seriesId && !!questionId && !!choiceId && (options?.enabled ?? true),
    }
  );
};
