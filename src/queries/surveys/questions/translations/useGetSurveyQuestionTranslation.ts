import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveyQuestionTranslation } from "@src/interfaces";
import { SURVEY_QUESTION_TRANSLATIONS_QUERY_KEY } from "./useGetSurveyQuestionTranslations";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_QUESTION_TRANSLATION_QUERY_KEY = (
  surveyId: string,
  questionId: string,
  locale: string
) => [...SURVEY_QUESTION_TRANSLATIONS_QUERY_KEY(surveyId, questionId), locale];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_QUESTION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SURVEY_QUESTION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyQuestionTranslation>>
) => {
  client.setQueryData(
    SURVEY_QUESTION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSurveyQuestionTranslationProps extends SingleQueryParams {
  surveyId: string;
  questionId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveyQuestionTranslation = async ({
  surveyId,
  questionId,
  locale,
  adminApiParams,
}: GetSurveyQuestionTranslationProps): Promise<
  ConnectedXMResponse<SurveyQuestionTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/questions/${questionId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveyQuestionTranslation = (
  surveyId: string = "",
  questionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSurveyQuestionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSurveyQuestionTranslation>
  >(
    SURVEY_QUESTION_TRANSLATION_QUERY_KEY(surveyId, questionId, locale),
    (params: SingleQueryParams) =>
      GetSurveyQuestionTranslation({
        surveyId,
        questionId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!surveyId &&
        !!questionId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    }
  );
};
