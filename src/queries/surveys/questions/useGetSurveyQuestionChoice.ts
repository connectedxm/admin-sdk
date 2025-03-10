import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveyQuestionChoice } from "@src/interfaces";
import { SURVEY_QUESTION_CHOICES_QUERY_KEY } from "./useGetSurveyQuestionChoices";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_QUESTION_CHOICE_QUERY_KEY = (
  surveyId: string,
  questionId: string,
  choiceId: string
) => [...SURVEY_QUESTION_CHOICES_QUERY_KEY(surveyId, questionId), choiceId];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_QUESTION_CHOICE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEY_QUESTION_CHOICE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyQuestionChoice>>
) => {
  client.setQueryData(SURVEY_QUESTION_CHOICE_QUERY_KEY(...keyParams), response);
};

interface GetSurveyQuestionChoiceProps extends SingleQueryParams {
  surveyId: string;
  questionId: string;
  choiceId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveyQuestionChoice = async ({
  surveyId,
  questionId,
  choiceId,
  adminApiParams,
}: GetSurveyQuestionChoiceProps): Promise<
  ConnectedXMResponse<SurveyQuestionChoice>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/questions/${questionId}/choices/${choiceId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveyQuestionChoice = (
  surveyId: string,
  questionId: string,
  choiceId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSurveyQuestionChoice>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSurveyQuestionChoice>>(
    SURVEY_QUESTION_CHOICE_QUERY_KEY(surveyId, questionId, choiceId),
    (params: SingleQueryParams) =>
      GetSurveyQuestionChoice({ surveyId, questionId, choiceId, ...params }),
    {
      ...options,
      enabled:
        !!surveyId && !!questionId && !!choiceId && (options?.enabled ?? true),
    },
    "surveys"
  );
};
