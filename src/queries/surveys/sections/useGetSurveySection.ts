import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveySection } from "@src/interfaces";
import { SURVEY_SECTIONS_QUERY_KEY } from "./useGetSurveySections";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_SECTION_QUERY_KEY = (
  surveyId: string,
  sectionId: string
) => [...SURVEY_SECTIONS_QUERY_KEY(surveyId), sectionId];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_SECTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEY_SECTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveySection>>
) => {
  client.setQueryData(SURVEY_SECTION_QUERY_KEY(...keyParams), response);
};

interface GetSurveySectionProps extends SingleQueryParams {
  surveyId: string;
  sectionId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveySection = async ({
  surveyId,
  sectionId,
  adminApiParams,
}: GetSurveySectionProps): Promise<ConnectedXMResponse<SurveySection>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/sections/${sectionId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveySection = (
  surveyId: string = "",
  sectionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSurveySection>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSurveySection>>(
    SURVEY_SECTION_QUERY_KEY(surveyId, sectionId),
    (params: SingleQueryParams) =>
      GetSurveySection({ surveyId, sectionId, ...params }),
    {
      ...options,
      enabled: !!surveyId && !!sectionId && (options?.enabled ?? true),
    }
  );
};
