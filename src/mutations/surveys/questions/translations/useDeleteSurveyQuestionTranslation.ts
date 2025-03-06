import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_QUESTION_TRANSLATIONS_QUERY_KEY,
  SURVEY_QUESTION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Question-Translations
 */
export interface DeleteSurveyQuestionTranslationParams extends MutationParams {
  surveyId: string;
  questionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Survey-Question-Translations
 */
export const DeleteSurveyQuestionTranslation = async ({
  surveyId,
  questionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteSurveyQuestionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/surveys/${surveyId}/questions/${questionId}/translations/${locale}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_TRANSLATIONS_QUERY_KEY(surveyId, questionId),
    });
    queryClient.invalidateQueries({
      queryKey: SURVEY_QUESTION_TRANSLATION_QUERY_KEY(
        surveyId,
        questionId,
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
export const useDeleteSurveyQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSurveyQuestionTranslation>>,
      Omit<
        DeleteSurveyQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSurveyQuestionTranslationParams,
    Awaited<ReturnType<typeof DeleteSurveyQuestionTranslation>>
  >(DeleteSurveyQuestionTranslation, options, {
    domain: "surveys",
    type: "update",
  });
};
