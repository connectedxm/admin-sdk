import { GetAdminAPI } from "@src/AdminAPI";
import { ISupportedLocale } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SurveySectionTranslationUpdateInputs } from "@src/params";
import {
  SURVEY_SECTION_TRANSLATIONS_QUERY_KEY,
  SET_SURVEY_SECTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Sections-Translations
 */
export interface UpdateSurveySectionTranslationParams extends MutationParams {
  surveyId: string;
  sectionId: string;
  locale: ISupportedLocale;
  sectionTranslation: SurveySectionTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Survey-Sections-Translations
 */
export const UpdateSurveySectionTranslation = async ({
  surveyId,
  sectionId,
  sectionTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateSurveySectionTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put(
    `/surveys/${surveyId}/sections/${sectionId}/translations/${locale}`,
    sectionTranslation
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_SECTION_TRANSLATIONS_QUERY_KEY(surveyId, sectionId),
    });

    SET_SURVEY_SECTION_TRANSLATION_QUERY_DATA(
      queryClient,
      [surveyId, sectionId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Survey-Sections-Translations
 */
export const useUpdateSurveySectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSurveySectionTranslation>>,
      Omit<
        UpdateSurveySectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveySectionTranslationParams,
    Awaited<ReturnType<typeof UpdateSurveySectionTranslation>>
  >(UpdateSurveySectionTranslation, options, {
    domain: "surveys",
    type: "update",
  });
};
