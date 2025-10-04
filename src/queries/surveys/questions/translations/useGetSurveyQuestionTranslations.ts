import { ConnectedXMResponse } from "@src/interfaces";
import { SurveyQuestionTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { SURVEY_QUESTION_QUERY_KEY } from "../useGetSurveyQuestion";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_QUESTION_TRANSLATIONS_QUERY_KEY = (
  surveyId: string,
  questionId: string
) => [...SURVEY_QUESTION_QUERY_KEY(surveyId, questionId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_QUESTION_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SURVEY_QUESTION_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyQuestionTranslations>>
) => {
  client.setQueryData(
    SURVEY_QUESTION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSurveyQuestionTranslationsProps extends InfiniteQueryParams {
  surveyId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveyQuestionTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  surveyId,
  questionId,
  adminApiParams,
}: GetSurveyQuestionTranslationsProps): Promise<
  ConnectedXMResponse<SurveyQuestionTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/questions/${questionId}/translations`,
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
export const useGetSurveyQuestionTranslations = (
  surveyId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveyQuestionTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveyQuestionTranslations>>
  >(
    SURVEY_QUESTION_TRANSLATIONS_QUERY_KEY(surveyId, questionId),
    (params: InfiniteQueryParams) =>
      GetSurveyQuestionTranslations({
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
