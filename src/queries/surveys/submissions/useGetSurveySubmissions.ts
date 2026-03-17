import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  PurchaseStatus,
  SurveySubmission,
} from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SURVEY_QUERY_KEY } from "../useGetSurvey";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_SUBMISSIONS_QUERY_KEY = (
  surveyId: string,
  status?: PurchaseStatus
) => {
  const key = [...SURVEY_QUERY_KEY(surveyId), "SUBMISSIONS"];
  if (status) {
    key.push(status);
  }
  return key;
};

interface GetSurveySubmissionsProps extends InfiniteQueryParams {
  surveyId: string;
  status?: PurchaseStatus;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveySubmissions = async ({
  surveyId,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSurveySubmissionsProps): Promise<
  ConnectedXMResponse<SurveySubmission[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/surveys/${surveyId}/submissions`, {
    params: {
      status: status || undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveySubmissions = (
  surveyId: string = "",
  status?: PurchaseStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveySubmissions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveySubmissions>>
  >(
    SURVEY_SUBMISSIONS_QUERY_KEY(surveyId, status),
    (params: InfiniteQueryParams) =>
      GetSurveySubmissions({
        ...params,
        surveyId,
        status,
      }),
    params,
    {
      ...options,
      enabled: !!surveyId && (options.enabled ?? true),
    }
  );
};
