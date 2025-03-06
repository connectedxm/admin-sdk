import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveyQuestionSearchValue } from "@src/interfaces";
import {
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
export const SURVEY_QUESTION_SEARCH_VALUES_QUERY_KEY = (
  surveyId: string,
  questionId: string
) => [...SURVEY_QUESTION_QUERY_KEY(surveyId, questionId), "SEARCH_VALUES"];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_QUESTION_SEARCH_VALUES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEY_QUESTION_SEARCH_VALUES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyQuestionSearchValues>>
) => {
  client.setQueryData(
    SURVEY_QUESTION_SEARCH_VALUES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSurveyQuestionSearchValuesProps extends InfiniteQueryParams {
  surveyId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveyQuestionSearchValues = async ({
  surveyId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSurveyQuestionSearchValuesProps): Promise<
  ConnectedXMResponse<SurveyQuestionSearchValue[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/questions/${questionId}/values`,
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
export const useGetSurveyQuestionSearchValues = (
  surveyId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveyQuestionSearchValues>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveyQuestionSearchValues>>
  >(
    SURVEY_QUESTION_SEARCH_VALUES_QUERY_KEY(surveyId, questionId),
    (params: InfiniteQueryParams) =>
      GetSurveyQuestionSearchValues({
        ...params,
        surveyId,
        questionId,
      }),
    params,
    {
      ...options,
      enabled: !!surveyId && !!questionId && (options.enabled ?? true),
    },
    "surveys"
  );
};
