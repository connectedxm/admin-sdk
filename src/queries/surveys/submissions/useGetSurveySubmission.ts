import { ConnectedXMResponse } from "@src/interfaces";
import { SurveySubmission } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { SURVEY_SUBMISSIONS_QUERY_KEY } from "./useGetSurveySubmissions";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_SUBMISSION_QUERY_KEY = (
  surveyId: string,
  submissionId: string
) => [...SURVEY_SUBMISSIONS_QUERY_KEY(surveyId), submissionId];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_SUBMISSION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SURVEY_SUBMISSION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveySubmission>>
) => {
  client.setQueryData(SURVEY_SUBMISSION_QUERY_KEY(...keyParams), response);
};

interface GetSurveySubmissionProps extends SingleQueryParams {
  surveyId: string;
  submissionId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveySubmission = async ({
  surveyId,
  submissionId,
  adminApiParams,
}: GetSurveySubmissionProps): Promise<
  ConnectedXMResponse<SurveySubmission>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/submissions/${submissionId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveySubmission = (
  surveyId: string = "",
  submissionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSurveySubmission>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSurveySubmission>>(
    SURVEY_SUBMISSION_QUERY_KEY(surveyId, submissionId),
    (params: SingleQueryParams) =>
      GetSurveySubmission({
        surveyId,
        submissionId,
        ...params,
      }),
    {
      ...options,
      enabled: !!surveyId && !!submissionId && (options?.enabled ?? true),
    }
  );
};
