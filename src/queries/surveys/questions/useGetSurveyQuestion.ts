import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveyQuestion } from "@src/interfaces";
import { SURVEY_QUESTIONS_QUERY_KEY } from "./useGetSurveyQuestions";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_QUESTION_QUERY_KEY = (
  surveyId: string,
  questionId: string
) => [...SURVEY_QUESTIONS_QUERY_KEY(surveyId), questionId];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_QUESTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEY_QUESTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyQuestion>>
) => {
  client.setQueryData(SURVEY_QUESTION_QUERY_KEY(...keyParams), response);
};

interface GetSurveyQuestionProps extends SingleQueryParams {
  surveyId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveyQuestion = async ({
  surveyId,
  questionId,
  adminApiParams,
}: GetSurveyQuestionProps): Promise<ConnectedXMResponse<SurveyQuestion>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/questions/${questionId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveyQuestion = (
  surveyId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSurveyQuestion>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSurveyQuestion>>(
    SURVEY_QUESTION_QUERY_KEY(surveyId, questionId),
    (params: SingleQueryParams) =>
      GetSurveyQuestion({ surveyId, questionId, ...params }),
    {
      ...options,
      enabled: !!surveyId && !!questionId && (options?.enabled ?? true),
    }
  );
};
