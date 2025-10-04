import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { SurveyQuestionChoiceSubQuestion } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SURVEY_QUESTION_CHOICE_QUERY_KEY } from "./useGetSurveyQuestionChoice";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_QUESTION_CHOICE_QUESTIONS_QUERY_KEY = (
  surveyId: string,
  questionId: string,
  choiceId: string
) => [
  ...SURVEY_QUESTION_CHOICE_QUERY_KEY(surveyId, questionId, choiceId),
  "QUESTIONS",
];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_QUESTION_CHOICE_QUESTIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SURVEY_QUESTION_CHOICE_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyQuestionChoiceSubQuestions>>
) => {
  client.setQueryData(
    SURVEY_QUESTION_CHOICE_QUESTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSurveyQuestionChoiceSubQuestionsProps extends InfiniteQueryParams {
  surveyId: string;
  questionId: string;
  choiceId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveyQuestionChoiceSubQuestions = async ({
  surveyId,
  questionId,
  choiceId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSurveyQuestionChoiceSubQuestionsProps): Promise<
  ConnectedXMResponse<SurveyQuestionChoiceSubQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/questions/${questionId}/choices/${choiceId}/subQuestions`,
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
 * @group Surveys
 */
export const useGetSurveyQuestionChoiceSubQuestions = (
  surveyId: string = "",
  questionId: string = "",
  choiceId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveyQuestionChoiceSubQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveyQuestionChoiceSubQuestions>>
  >(
    SURVEY_QUESTION_CHOICE_QUESTIONS_QUERY_KEY(surveyId, questionId, choiceId),
    (params: any) =>
      GetSurveyQuestionChoiceSubQuestions({
        surveyId,
        questionId,
        choiceId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled:
        !!surveyId && !!questionId && !!choiceId && (options.enabled ?? true),
    }
  );
};
