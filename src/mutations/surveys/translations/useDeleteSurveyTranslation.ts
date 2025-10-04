import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_TRANSLATIONS_QUERY_KEY,
  SURVEY_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Translations
 */
export interface DeleteSurveyTranslationParams extends MutationParams {
  surveyId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Survey-Translations
 */
export const DeleteSurveyTranslation = async ({
  surveyId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteSurveyTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/surveys/${surveyId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_TRANSLATIONS_QUERY_KEY(surveyId),
    });
    queryClient.invalidateQueries({
      queryKey: SURVEY_TRANSLATION_QUERY_KEY(surveyId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Translations
 */
export const useDeleteSurveyTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSurveyTranslation>>,
      Omit<DeleteSurveyTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSurveyTranslationParams,
    Awaited<ReturnType<typeof DeleteSurveyTranslation>>
  >(DeleteSurveyTranslation, options);
};
