import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { ConnectedXMResponse, MeetingLink } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_LINKS_QUERY_KEY = (meetingId: string) => {
  return ["MEETINGS", meetingId, "LINKS"];
};

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_LINKS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_LINKS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingLinks>>
) => {
  client.setQueryData(MEETING_LINKS_QUERY_KEY(...keyParams), response);
};

interface GetMeetingLinksParams extends InfiniteQueryParams {
  meetingId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingLinks = async ({
  meetingId,
  pageParam,
  pageSize,
  orderBy,
  adminApiParams,
}: GetMeetingLinksParams): Promise<ConnectedXMResponse<MeetingLink[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/meetings/${meetingId}/links`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
    },
  });

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeetingLinks = (
  meetingId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetMeetingLinks>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetMeetingLinks>>>(
    MEETING_LINKS_QUERY_KEY(meetingId),
    (params: InfiniteQueryParams) => GetMeetingLinks({ meetingId, ...params }),
    params,
    {
      ...options,
      enabled: !!meetingId && (options?.enabled ?? true),
    }
  );
};

