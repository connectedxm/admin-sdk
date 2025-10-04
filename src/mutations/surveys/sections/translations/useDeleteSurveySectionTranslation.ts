import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_SECTION_TRANSLATIONS_QUERY_KEY,
  SURVEY_SECTION_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Sections-Translations
 */
export interface DeleteSurveySectionTranslationParams extends MutationParams {
  surveyId: string;
  sectionId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Survey-Sections-Translations
 */
export const DeleteSurveySectionTranslation = async ({
  surveyId,
  sectionId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteSurveySectionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/surveys/${surveyId}/sections/${sectionId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_SECTION_TRANSLATIONS_QUERY_KEY(surveyId, sectionId),
    });
    queryClient.invalidateQueries({
      queryKey: SURVEY_SECTION_TRANSLATION_QUERY_KEY(
        surveyId,
        sectionId,
        locale
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Sections-Translations
 */
export const useDeleteSurveySectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteSurveySectionTranslation>>,
      Omit<
        DeleteSurveySectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSurveySectionTranslationParams,
    Awaited<ReturnType<typeof DeleteSurveySectionTranslation>>
  >(DeleteSurveySectionTranslation, options);
};
