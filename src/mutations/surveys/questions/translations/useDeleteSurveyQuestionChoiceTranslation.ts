import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY,
  SURVEY_QUESTION_CHOICE_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Question-Translations
 */
export interface DeleteSurveyQuestionChoiceTranslationParams
  extends MutationParams {
  surveyId: string;
  questionId: string;
  choiceId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Survey-Question-Translations
 */
export const DeleteSurveyQuestionChoiceTranslation = async ({
  surveyId,
  questionId,
  choiceId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteSurveyQuestionChoiceTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/surveys/${surveyId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
        surveyId,
        questionId,
        choiceId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_CHOICE_TRANSLATION_QUERY_KEY(
        surveyId,
        questionId,
        choiceId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Question-Translations
 */
export const useDeleteSurveyQuestionChoiceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSurveyQuestionChoiceTranslation>>,
      Omit<
        DeleteSurveyQuestionChoiceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSurveyQuestionChoiceTranslationParams,
    Awaited<ReturnType<typeof DeleteSurveyQuestionChoiceTranslation>>
  >(DeleteSurveyQuestionChoiceTranslation, options);
};
