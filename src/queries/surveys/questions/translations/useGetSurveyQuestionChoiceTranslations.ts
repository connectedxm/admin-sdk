import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveyQuestionChoiceTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { SURVEY_QUESTION_CHOICE_QUERY_KEY } from "../useGetSurveyQuestionChoice";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY = (
  surveyId: string,
  questionId: string,
  choiceId: string
) => [
  ...SURVEY_QUESTION_CHOICE_QUERY_KEY(surveyId, questionId, choiceId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_QUESTION_CHOICE_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SURVEY_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyQuestionChoiceTranslations>>
) => {
  client.setQueryData(
    SURVEY_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSurveyQuestionChoiceTranslationsProps extends InfiniteQueryParams {
  surveyId: string;
  questionId: string;
  choiceId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveyQuestionChoiceTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  surveyId,
  questionId,
  choiceId,
  adminApiParams,
}: GetSurveyQuestionChoiceTranslationsProps): Promise<
  ConnectedXMResponse<SurveyQuestionChoiceTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/questions/${questionId}/choices/${choiceId}/translations`,
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
export const useGetSurveyQuestionChoiceTranslations = (
  surveyId: string = "",
  questionId: string = "",
  choiceId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveyQuestionChoiceTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveyQuestionChoiceTranslations>>
  >(
    SURVEY_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
      surveyId,
      questionId,
      choiceId
    ),
    (params: InfiniteQueryParams) =>
      GetSurveyQuestionChoiceTranslations({
        ...params,
        surveyId,
        questionId,
        choiceId,
      }),
    params,
    {
      ...options,
      enabled:
        !!surveyId && !!questionId && !!choiceId && (options.enabled ?? true),
    }
  );
};
