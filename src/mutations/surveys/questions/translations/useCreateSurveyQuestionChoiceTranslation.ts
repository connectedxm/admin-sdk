import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  SurveyQuestionChoiceTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY,
  SET_SURVEY_QUESTION_CHOICE_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Question-Translations
 */
export interface CreateSurveyQuestionChoiceTranslationParams
  extends MutationParams {
  surveyId: string;
  questionId: string;
  choiceId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Survey-Question-Translations
 */
export const CreateSurveyQuestionChoiceTranslation = async ({
  surveyId,
  questionId,
  choiceId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateSurveyQuestionChoiceTranslationParams): Promise<
  ConnectedXMResponse<SurveyQuestionChoiceTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post(
    `/surveys/${surveyId}/questions/${questionId}/choices/${choiceId}/translations`,
    {
      locale,
      autoTranslate,
    }
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
      [surveyId, questionId, choiceId, data?.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Question-Translations
 */
export const useCreateSurveyQuestionChoiceTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSurveyQuestionChoiceTranslation>>,
      Omit<
        CreateSurveyQuestionChoiceTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSurveyQuestionChoiceTranslationParams,
    Awaited<ReturnType<typeof CreateSurveyQuestionChoiceTranslation>>
  >(CreateSurveyQuestionChoiceTranslation, options, {
    domain: "surveys",
    type: "update",
  });
};
