import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { ConnectedXMResponse, MeetingRecording } from "@src/interfaces";
import { MEETING_QUERY_KEY } from "../meetings/useGetMeeting";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_RECORDINGS_QUERY_KEY = (meetingId: string) => [
  ...MEETING_QUERY_KEY(meetingId),
  "RECORDINGS",
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_RECORDINGS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_RECORDINGS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingRecordings>>
) => {
  client.setQueryData(MEETING_RECORDINGS_QUERY_KEY(...keyParams), response);
};

interface GetMeetingRecordingsParams extends InfiniteQueryParams {
  meetingId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingRecordings = async ({
  meetingId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetMeetingRecordingsParams): Promise<
  ConnectedXMResponse<MeetingRecording[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/meetings/${meetingId}/recordings`,
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
 * @group StreamsV2
 */
export const useGetMeetingRecordings = (
  meetingId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetMeetingRecordings>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetMeetingRecordings>>
  >(
    MEETING_RECORDINGS_QUERY_KEY(meetingId),
    (params: InfiniteQueryParams) =>
      GetMeetingRecordings({ ...params, meetingId }),
    params,
    {
      ...options,
      enabled: !!meetingId && (options?.enabled ?? true),
    }
  );
};
