import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveyQuestionChoice } from "@src/interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SURVEY_QUESTION_QUERY_KEY } from "./useGetSurveyQuestion";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_QUESTION_CHOICES_QUERY_KEY = (
  surveyId: string,
  questionId: string
) => [...SURVEY_QUESTION_QUERY_KEY(surveyId, questionId), "CHOICES"];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_QUESTION_CHOICES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEY_QUESTION_CHOICES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyQuestionChoices>>
) => {
  client.setQueryData(
    [
      ...SURVEY_QUESTION_CHOICES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(""),
    ],
    {
      pages: [response],
      pageParams: [null],
    }
  );
};

interface GetSurveyQuestionChoicesProps extends InfiniteQueryParams {
  surveyId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveyQuestionChoices = async ({
  surveyId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSurveyQuestionChoicesProps): Promise<
  ConnectedXMResponse<SurveyQuestionChoice[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/questions/${questionId}/choices`,
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
export const useGetSurveyQuestionChoices = (
  surveyId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveyQuestionChoices>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveyQuestionChoices>>
  >(
    SURVEY_QUESTION_CHOICES_QUERY_KEY(surveyId, questionId),
    (params: InfiniteQueryParams) =>
      GetSurveyQuestionChoices({
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
