import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SurveySection } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { SURVEY_SUBMISSION_QUERY_KEY } from "./useGetSurveySubmission";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_QUESTION_SECTIONS_QUERY_KEY = (
  surveyId: string,
  submissionId: string
) => [...SURVEY_SUBMISSION_QUERY_KEY(surveyId, submissionId), "SECTIONS"];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_QUESTION_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEY_QUESTION_SECTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveySubmissionQuestionSections>>
) => {
  client.setQueryData(
    SURVEY_QUESTION_SECTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSurveySubmissionQuestionSectionsProps extends InfiniteQueryParams {
  surveyId: string;
  submissionId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveySubmissionQuestionSections = async ({
  surveyId,
  submissionId,
  adminApiParams,
}: GetSurveySubmissionQuestionSectionsProps): Promise<
  ConnectedXMResponse<SurveySection[]>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.get<ConnectedXMResponse<SurveySection[]>>(
    `/surveys/${surveyId}/submissions/${submissionId}/sections`
  );
  return data;
};

/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveySubmissionQuestionSections = (
  surveyId: string = "",
  submissionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveySubmissionQuestionSections>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveySubmissionQuestionSections>>
  >(
    SURVEY_QUESTION_SECTIONS_QUERY_KEY(surveyId, submissionId),
    (params: InfiniteQueryParams) =>
      GetSurveySubmissionQuestionSections({
        ...params,
        surveyId,
        submissionId,
      }),
    params,
    {
      ...options,
      enabled: !!surveyId && !!submissionId,
    },
    "surveys"
  );
};
