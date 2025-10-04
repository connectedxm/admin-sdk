import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SurveyQuestionTranslationUpdateInputs } from "@src/params";
import {
  SURVEY_QUESTION_TRANSLATIONS_QUERY_KEY,
  SET_SURVEY_QUESTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Question-Translations
 */
export interface UpdateSurveyQuestionTranslationParams extends MutationParams {
  surveyId: string;
  questionId: string;
  locale: ISupportedLocale;
  questionTranslation: SurveyQuestionTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Survey-Question-Translations
 */
export const UpdateSurveyQuestionTranslation = async ({
  surveyId,
  questionId,
  locale,
  questionTranslation,
  adminApiParams,
  queryClient,
}: UpdateSurveyQuestionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/surveys/${surveyId}/questions/${questionId}/translations/${locale}`,
    questionTranslation
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_TRANSLATIONS_QUERY_KEY(surveyId, questionId),
    });
    SET_SURVEY_QUESTION_TRANSLATION_QUERY_DATA(
      queryClient,
      [surveyId, questionId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Question-Translations
 */
export const useUpdateSurveyQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSurveyQuestionTranslation>>,
      Omit<
        UpdateSurveyQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveyQuestionTranslationParams,
    Awaited<ReturnType<typeof UpdateSurveyQuestionTranslation>>
  >(UpdateSurveyQuestionTranslation, options);
};
