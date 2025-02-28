import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, SurveySubmission } from "@src/interfaces";
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
export const SURVEY_SUBMISSIONS_QUERY_KEY = (surveyId: string) => [
  ...SURVEY_QUERY_KEY(surveyId),
  "SUBMISSIONS",
];

interface GetSurveySubmissionsProps extends InfiniteQueryParams {
  surveyId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveySubmissions = async ({
  surveyId,
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
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveySubmissions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveySubmissions>>
  >(
    SURVEY_SUBMISSIONS_QUERY_KEY(surveyId),
    (params: InfiniteQueryParams) =>
      GetSurveySubmissions({
        ...params,
        surveyId,
      }),
    params,
    {
      ...options,
      enabled: !!surveyId && (options.enabled ?? true),
    },
    "surveys"
  );
};
