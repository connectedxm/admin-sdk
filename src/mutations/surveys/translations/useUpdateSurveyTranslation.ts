import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SurveyTranslationUpdateInputs } from "@src/params";
import {
  SURVEY_TRANSLATIONS_QUERY_KEY,
  SET_SURVEY_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Translations
 */
export interface UpdateSurveyTranslationParams extends MutationParams {
  surveyId: string;
  locale: ISupportedLocale;
  surveyTranslation: SurveyTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Survey-Translations
 */
export const UpdateSurveyTranslation = async ({
  surveyId,
  surveyTranslation,
  adminApiParams,
  locale,
  queryClient,
}: UpdateSurveyTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/surveys/${surveyId}/translations/${locale}`,
    surveyTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_TRANSLATIONS_QUERY_KEY(surveyId),
    });
    SET_SURVEY_TRANSLATION_QUERY_DATA(
      queryClient,
      [surveyId, data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Translations
 */
export const useUpdateSurveyTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSurveyTranslation>>,
      Omit<UpdateSurveyTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveyTranslationParams,
    Awaited<ReturnType<typeof UpdateSurveyTranslation>>
  >(UpdateSurveyTranslation, options, {
    domain: "surveys",
    type: "update",
  });
};
