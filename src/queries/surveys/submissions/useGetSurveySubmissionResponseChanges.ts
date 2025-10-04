import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SurveyQuestionResponseChange } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SURVEY_SUBMISSION_QUERY_KEY } from "./useGetSurveySubmission";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_SUBMISSION_RESPONSE_CHANGES_QUERY_KEY = (
  surveyId: string,
  submissionId: string,
  questionId: string
) => [
  SURVEY_SUBMISSION_QUERY_KEY(surveyId, submissionId),
  questionId,
  "CHANGES",
];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_SUBMISSION_RESPONSE_CHANGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEY_SUBMISSION_RESPONSE_CHANGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveySubmissionResponseChanges>>
) => {
  client.setQueryData(
    SURVEY_SUBMISSION_RESPONSE_CHANGES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSurveySubmissionResponseChangesProps extends InfiniteQueryParams {
  surveyId: string;
  submissionId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveySubmissionResponseChanges = async ({
  surveyId,
  submissionId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSurveySubmissionResponseChangesProps): Promise<
  ConnectedXMResponse<SurveyQuestionResponseChange[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/surveys/${surveyId}/submissions/${submissionId}/responses/${questionId}/changes`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveySubmissionResponseChanges = (
  surveyId: string = "",
  submissionId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveySubmissionResponseChanges>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveySubmissionResponseChanges>>
  >(
    SURVEY_SUBMISSION_RESPONSE_CHANGES_QUERY_KEY(
      surveyId,
      submissionId,
      questionId
    ),
    (params: InfiniteQueryParams) =>
      GetSurveySubmissionResponseChanges({
        ...params,
        surveyId,
        questionId,
        submissionId,
      }),
    params,
    {
      ...options,
      enabled:
        !!surveyId &&
        !!questionId &&
        !!submissionId &&
        (options.enabled ?? true),
    }
  );
};
