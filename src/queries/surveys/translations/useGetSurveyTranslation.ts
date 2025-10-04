import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveyTranslation } from "@src/interfaces";
import { SURVEY_TRANSLATIONS_QUERY_KEY } from "./useGetSurveyTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_TRANSLATION_QUERY_KEY = (
  surveyId: string,
  locale: string
) => [...SURVEY_TRANSLATIONS_QUERY_KEY(surveyId), locale];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SURVEY_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveyTranslation>>
) => {
  client.setQueryData(SURVEY_TRANSLATION_QUERY_KEY(...keyParams), response);
};

interface GetSurveyTranslationProps extends SingleQueryParams {
  surveyId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveyTranslation = async ({
  surveyId,
  locale,
  adminApiParams,
}: GetSurveyTranslationProps): Promise<
  ConnectedXMResponse<SurveyTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveyTranslation = (
  surveyId: string = "",
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSurveyTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSurveyTranslation>>(
    SURVEY_TRANSLATION_QUERY_KEY(surveyId, locale),
    (params: SingleQueryParams) =>
      GetSurveyTranslation({
        ...params,
        surveyId,
        locale,
      }),
    {
      ...options,
      enabled: !!surveyId && !!locale && locale !== "en",
    }
  );
};
