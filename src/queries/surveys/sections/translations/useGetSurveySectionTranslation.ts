import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveySectionTranslation } from "@src/interfaces";
import { SURVEY_SECTION_TRANSLATIONS_QUERY_KEY } from "./useGetSurveySectionTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_SECTION_TRANSLATION_QUERY_KEY = (
  surveyId: string,
  sectionId: string,
  locale: string
) => [...SURVEY_SECTION_TRANSLATIONS_QUERY_KEY(surveyId, sectionId), locale];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_SECTION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SURVEY_SECTION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveySectionTranslation>>
) => {
  client.setQueryData(
    SURVEY_SECTION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSurveySectionTranslationProps extends SingleQueryParams {
  surveyId: string;
  sectionId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveySectionTranslation = async ({
  surveyId,
  sectionId,
  locale,
  adminApiParams,
}: GetSurveySectionTranslationProps): Promise<
  ConnectedXMResponse<SurveySectionTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/sections/${sectionId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveySectionTranslation = (
  surveyId: string = "",
  sectionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSurveySectionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSurveySectionTranslation>
  >(
    SURVEY_SECTION_TRANSLATION_QUERY_KEY(surveyId, sectionId, locale),
    (params: SingleQueryParams) =>
      GetSurveySectionTranslation({
        ...params,
        surveyId,
        sectionId,
        locale,
      }),
    {
      ...options,
      enabled: !!surveyId && !!sectionId && !!locale && locale !== "en",
    },
    "surveys"
  );
};
