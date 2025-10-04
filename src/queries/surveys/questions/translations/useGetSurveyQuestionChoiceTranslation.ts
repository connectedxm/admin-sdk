import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveyQuestionChoiceTranslation } from "@src/interfaces";
import { SURVEY_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY } from "./useGetSurveyQuestionChoiceTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_QUESTION_CHOICE_TRANSLATION_QUERY_KEY = (
  surveyId: string,
  questionId: string,
  choiceId: string,
  locale: string
) => [
  ...SURVEY_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
    surveyId,
    questionId,
    choiceId
  ),
  locale,
];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_QUESTION_CHOICE_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SURVEY_QUESTION_CHOICE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyQuestionChoiceTranslation>>
) => {
  client.setQueryData(
    SURVEY_QUESTION_CHOICE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSurveyQuestionChoiceTranslationProps extends SingleQueryParams {
  surveyId: string;
  questionId: string;
  choiceId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveyQuestionChoiceTranslation = async ({
  surveyId,
  questionId,
  choiceId,
  locale,
  adminApiParams,
}: GetSurveyQuestionChoiceTranslationProps): Promise<
  ConnectedXMResponse<SurveyQuestionChoiceTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveyQuestionChoiceTranslation = (
  surveyId: string = "",
  questionId: string = "",
  choiceId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSurveyQuestionChoiceTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSurveyQuestionChoiceTranslation>
  >(
    SURVEY_QUESTION_CHOICE_TRANSLATION_QUERY_KEY(
      surveyId,
      questionId,
      choiceId,
      locale
    ),
    (params: SingleQueryParams) =>
      GetSurveyQuestionChoiceTranslation({
        surveyId,
        questionId,
        choiceId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!surveyId && !!questionId && !!choiceId && !!locale && locale !== "en",
    }
  );
};
