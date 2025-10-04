import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  SurveyQuestionTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_QUESTION_TRANSLATIONS_QUERY_KEY,
  SET_SURVEY_QUESTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Question-Translations
 */
export interface CreateSurveyQuestionTranslationParams extends MutationParams {
  surveyId: string;
  questionId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Survey-Question-Translations
 */
export const CreateSurveyQuestionTranslation = async ({
  surveyId,
  questionId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateSurveyQuestionTranslationParams): Promise<
  ConnectedXMResponse<SurveyQuestionTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post(
    `/surveys/${surveyId}/questions/${questionId}/translations`,
    {
      locale,
      autoTranslate,
    }
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
export const useCreateSurveyQuestionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSurveyQuestionTranslation>>,
      Omit<
        CreateSurveyQuestionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSurveyQuestionTranslationParams,
    Awaited<ReturnType<typeof CreateSurveyQuestionTranslation>>
  >(CreateSurveyQuestionTranslation, options);
};
