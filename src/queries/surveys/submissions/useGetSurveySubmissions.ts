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
) => [...SURVEY_QUERY_KEY(surveyId), "SUBMISSIONS", status || "ALL"];

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
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > & {
    status?: PurchaseStatus;
  } = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveySubmissions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveySubmissions>>
  >(
    SURVEY_SUBMISSIONS_QUERY_KEY(surveyId, params.status),
    (params: InfiniteQueryParams) =>
      GetSurveySubmissions({
        ...params,
        surveyId,
      }),
    params,
    {
      ...options,
      enabled: !!surveyId && (options.enabled ?? true),
    }
  );
};
