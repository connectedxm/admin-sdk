import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Survey } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { SURVEYS_QUERY_KEY } from "./useGetSurveys";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_QUERY_KEY = (surveyId: string) => [
  ...SURVEYS_QUERY_KEY(),
  surveyId,
];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurvey>>
) => {
  client.setQueryData(SURVEY_QUERY_KEY(...keyParams), response);
};

interface GetSurveyProps extends SingleQueryParams {
  surveyId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurvey = async ({
  surveyId,
  adminApiParams,
}: GetSurveyProps): Promise<ConnectedXMResponse<Survey>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/surveys/${surveyId}`);
  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurvey = (
  surveyId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSurvey>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSurvey>>(
    SURVEY_QUERY_KEY(surveyId),
    (params: SingleQueryParams) => GetSurvey({ surveyId, ...params }),
    {
      ...options,
      enabled: !!surveyId && (options?.enabled ?? true),
    },
    "surveys"
  );
};
