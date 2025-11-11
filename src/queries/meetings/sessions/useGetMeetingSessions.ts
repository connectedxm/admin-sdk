import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { ConnectedXMResponse, MeetingSession } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_SESSIONS_QUERY_KEY = (meetingId?: string) => {
  const keys = ["MEETINGS", "SESSIONS"];
  if (meetingId) {
    keys.push(meetingId);
  }
  return keys;
};

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_SESSIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingSessions>>
) => {
  client.setQueryData(MEETING_SESSIONS_QUERY_KEY(...keyParams), response);
};

interface GetMeetingSessionsParams extends InfiniteQueryParams {
  meetingId?: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingSessions = async ({
  meetingId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetMeetingSessionsParams): Promise<
  ConnectedXMResponse<MeetingSession[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/meetings/sessions`, {
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
export const useGetMeetingSessions = (
  meetingId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetMeetingSessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetMeetingSessions>>
  >(
    MEETING_SESSIONS_QUERY_KEY(meetingId),
    (params: InfiniteQueryParams) =>
      GetMeetingSessions({ ...params, meetingId }),
    params,
    options
  );
};
