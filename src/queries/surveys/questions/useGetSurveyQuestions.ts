import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveyQuestion } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SURVEY_QUERY_KEY } from "../useGetSurvey";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_QUESTIONS_QUERY_KEY = (surveyId: string) => [
  ...SURVEY_QUERY_KEY(surveyId),
  "QUESTIONS",
];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEY_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyQuestions>>
) => {
  client.setQueryData(SURVEY_QUESTIONS_QUERY_KEY(...keyParams), response);
};

interface GetSurveyQuestionsProps extends InfiniteQueryParams {
  surveyId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveyQuestions = async ({
  surveyId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSurveyQuestionsProps): Promise<ConnectedXMResponse<SurveyQuestion[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/surveys/${surveyId}/questions`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveyQuestions = (
  surveyId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveyQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveyQuestions>>
  >(
    SURVEY_QUESTIONS_QUERY_KEY(surveyId),
    (params: InfiniteQueryParams) =>
      GetSurveyQuestions({
        ...params,
        surveyId,
      }),
    params,
    {
      ...options,
      enabled: !!surveyId && (options.enabled ?? true),
    },
    "surveys"
  );
};
