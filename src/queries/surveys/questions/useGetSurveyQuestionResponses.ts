import { ConnectedXMResponse } from "@src/interfaces";
import { SurveyQuestionResponse } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SURVEY_QUESTION_QUERY_KEY } from "./useGetSurveyQuestion";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_QUESTION_RESPONSES_QUERY_KEY = (
  surveyId: string,
  questionId: string
) => [...SURVEY_QUESTION_QUERY_KEY(surveyId, questionId), "RESPONSES"];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_QUESTION_RESPONSES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SURVEY_QUESTION_RESPONSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyQuestionResponses>>
) => {
  client.setQueryData(
    SURVEY_QUESTION_RESPONSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSurveyQuestionResponsesProps extends InfiniteQueryParams {
  surveyId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveyQuestionResponses = async ({
  surveyId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSurveyQuestionResponsesProps): Promise<
  ConnectedXMResponse<SurveyQuestionResponse[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/questions/${questionId}/responses`,
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
export const useGetSurveyQuestionResponses = (
  surveyId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveyQuestionResponses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveyQuestionResponses>>
  >(
    SURVEY_QUESTION_RESPONSES_QUERY_KEY(surveyId, questionId),
    (params: InfiniteQueryParams) =>
      GetSurveyQuestionResponses({
        ...params,
        surveyId,
        questionId,
      }),
    params,
    {
      ...options,
      enabled: !!surveyId && !!questionId && (options.enabled ?? true),
    }
  );
};
