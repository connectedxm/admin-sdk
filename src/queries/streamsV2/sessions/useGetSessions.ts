import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { ConnectedXMResponse, Session } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const SESSIONS_QUERY_KEY = (meetingId?: string) => {
  const keys = ["STREAMS_V2", "SESSIONS"];
  if (meetingId) {
    keys.push(meetingId);
  }
  return keys;
};

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSessions>>
) => {
  client.setQueryData(SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetSessionsParams extends InfiniteQueryParams {
  meetingId?: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetSessions = async ({
  meetingId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSessionsParams): Promise<ConnectedXMResponse<Session[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/v2/sessions`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      meetingId: meetingId || undefined,
    },
  });

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetSessions = (
  meetingId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSessions>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSessions>>>(
    SESSIONS_QUERY_KEY(meetingId),
    (params: InfiniteQueryParams) => GetSessions({ ...params, meetingId }),
    params,
    options
  );
};
