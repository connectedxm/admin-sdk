import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSession } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SURVEY_QUERY_KEY } from "./useGetSurvey";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEY_SESSIONS_QUERY_KEY = (surveyId: string) => [
  ...SURVEY_QUERY_KEY(surveyId),
  "SESSIONS",
];

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEY_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEY_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveySessions>>
) => {
  client.setQueryData(SURVEY_SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetSurveySessionsProps extends InfiniteQueryParams {
  surveyId: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveySessions = async ({
  surveyId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSurveySessionsProps): Promise<ConnectedXMResponse<EventSession[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/surveys/${surveyId}/sessions`, {
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
export const useGetSurveySessions = (
  surveyId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveySessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveySessions>>
  >(
    SURVEY_SESSIONS_QUERY_KEY(surveyId),
    (params: InfiniteQueryParams) =>
      GetSurveySessions({
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
