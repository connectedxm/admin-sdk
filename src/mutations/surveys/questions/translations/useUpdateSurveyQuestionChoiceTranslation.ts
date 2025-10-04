import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SurveyQuestionChoiceTranslationUpdateInputs } from "@src/params";
import {
  SURVEY_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY,
  SET_SURVEY_QUESTION_CHOICE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Question-Translations
 */
export interface UpdateSurveyQuestionChoiceTranslationParams
  extends MutationParams {
  surveyId: string;
  questionId: string;
  choiceId: string;
  locale: ISupportedLocale;
  choiceTranslation: SurveyQuestionChoiceTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Survey-Question-Translations
 */
export const UpdateSurveyQuestionChoiceTranslation = async ({
  surveyId,
  questionId,
  choiceId,
  locale,
  choiceTranslation,
  adminApiParams,
  queryClient,
}: UpdateSurveyQuestionChoiceTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/surveys/${surveyId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`,
    choiceTranslation
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
        surveyId,
        questionId,
        choiceId
      ),
    });
    SET_SURVEY_QUESTION_CHOICE_TRANSLATION_QUERY_DATA(
      queryClient,
      [surveyId, questionId, choiceId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Question-Translations
 */
export const useUpdateSurveyQuestionChoiceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSurveyQuestionChoiceTranslation>>,
      Omit<
        UpdateSurveyQuestionChoiceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveyQuestionChoiceTranslationParams,
    Awaited<ReturnType<typeof UpdateSurveyQuestionChoiceTranslation>>
  >(UpdateSurveyQuestionChoiceTranslation, options);
};
