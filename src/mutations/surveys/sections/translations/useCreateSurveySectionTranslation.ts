import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SurveySectionTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SURVEY_SECTION_TRANSLATIONS_QUERY_KEY,
  SET_SURVEY_SECTION_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Survey-Sections-Translations
 */
export interface CreateSurveySectionTranslationParams extends MutationParams {
  surveyId: string;
  sectionId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Survey-Sections-Translations
 */
export const CreateSurveySectionTranslation = async ({
  surveyId,
  sectionId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateSurveySectionTranslationParams): Promise<
  ConnectedXMResponse<SurveySectionTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<SurveySectionTranslation>
  >(`/surveys/${surveyId}/sections/${sectionId}/translations`, {
    locale,
    autoTranslate,
  });
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
export const useCreateSurveySectionTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateSurveySectionTranslation>>,
      Omit<
        CreateSurveySectionTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSurveySectionTranslationParams,
    Awaited<ReturnType<typeof CreateSurveySectionTranslation>>
  >(CreateSurveySectionTranslation, options);
};
