import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SurveyTranslation } from "@src/interfaces";
import {
  MutationParams,
  ConnectedXMMutationOptions,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_TRANSLATIONS_QUERY_KEY,
  SET_SURVEY_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Translations
 */
export interface CreateSurveyTranslationParams extends MutationParams {
  surveyId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Survey-Translations
 */
export const CreateSurveyTranslation = async ({
  surveyId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateSurveyTranslationParams): Promise<
  ConnectedXMResponse<SurveyTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<SurveyTranslation>
  >(`/surveys/${surveyId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_TRANSLATIONS_QUERY_KEY(surveyId),
    });
    SET_SURVEY_TRANSLATION_QUERY_DATA(
      queryClient,
      [surveyId, data.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Translations
 */
export const useCreateSurveyTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSurveyTranslation>>,
      Omit<CreateSurveyTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSurveyTranslationParams,
    Awaited<ReturnType<typeof CreateSurveyTranslation>>
  >(CreateSurveyTranslation, options);
};

export default useCreateSurveyTranslation;
