import { ConnectedXMResponse } from "@src/interfaces";
import { SearchListValue } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Survey-Question-SearchList-Values
 */
export const SURVEY_QUESTION_SEARCHLIST_VALUES_QUERY_KEY = (
  surveyId: string,
  questionId: string
) => ["SURVEY_QUESTION_SEARCHLIST_VALUES", surveyId, questionId];

/**
 * @category Setters
 * @group Survey-Question-SearchList-Values
 */
export const SET_SURVEY_QUESTION_SEARCHLIST_VALUES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEY_QUESTION_SEARCHLIST_VALUES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyQuestionSearchListValues>>
) => {
  client.setQueryData(
    SURVEY_QUESTION_SEARCHLIST_VALUES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSurveyQuestionSearchListValuesProps extends InfiniteQueryParams {
  surveyId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Survey-Question-SearchList-Values
 */
export const GetSurveyQuestionSearchListValues = async ({
  surveyId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSurveyQuestionSearchListValuesProps): Promise<
  ConnectedXMResponse<SearchListValue[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/questions/${questionId}/searchlist/values`,
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
 * @group Survey-Question-SearchList-Values
 */
export const useGetSurveyQuestionSearchListValues = (
  surveyId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveyQuestionSearchListValues>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveyQuestionSearchListValues>>
  >(
    SURVEY_QUESTION_SEARCHLIST_VALUES_QUERY_KEY(surveyId, questionId),
    (queryParams: InfiniteQueryParams) =>
      GetSurveyQuestionSearchListValues({
        surveyId,
        questionId,
        ...queryParams,
      }),
    params,
    {
      ...options,
      enabled: !!surveyId && !!questionId && (options?.enabled ?? true),
    },
    "surveys"
  );
};
