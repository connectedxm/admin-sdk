import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Survey } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

/**
 * @category Keys
 * @group Surveys
 */
export const SURVEYS_QUERY_KEY = (
  eventId?: string,
  sessionId?: string,
  activationId?: string
) => {
  const keys = ["SURVEYS"];
  if (eventId) keys.push(eventId);
  if (sessionId) keys.push(sessionId);
  if (activationId) keys.push(activationId);
  return keys;
};

/**
 * @category Setters
 * @group Surveys
 */
export const SET_SURVEYS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEYS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveys>>
) => {
  client.setQueryData(SURVEYS_QUERY_KEY(...keyParams), response);
};

interface GetSurveysProps extends InfiniteQueryParams {
  eventId?: string;
  sessionId?: string;
  activationId?: string;
}

/**
 * @category Queries
 * @group Surveys
 */
export const GetSurveys = async ({
  eventId,
  sessionId,
  activationId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSurveysProps): Promise<ConnectedXMResponse<Survey[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/surveys`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      eventId: eventId || undefined,
      sessionId: sessionId || undefined,
      activationId: activationId || undefined,
    },
  });

  return data;
};
/**
 * @category Hooks
 * @group Surveys
 */
export const useGetSurveys = (
  eventId?: string,
  sessionId?: string,
  activationId?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSurveys>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSurveys>>>(
    SURVEYS_QUERY_KEY(eventId, sessionId, activationId),
    (params: InfiniteQueryParams) =>
      GetSurveys({
        ...params,
        eventId,
        sessionId,
        activationId,
      }),
    params,
    options
  );
};
