import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { ConnectedXMResponse, Participant } from "@src/interfaces";
import { MEETING_QUERY_KEY } from "./useGetMeeting";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_PARTICIPANTS_QUERY_KEY = (meetingId: string) => [
  ...MEETING_QUERY_KEY(meetingId),
  "PARTICIPANTS",
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_PARTICIPANTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_PARTICIPANTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingParticipants>>
) => {
  client.setQueryData(MEETING_PARTICIPANTS_QUERY_KEY(...keyParams), response);
};

interface GetMeetingParticipantsParams extends InfiniteQueryParams {
  meetingId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingParticipants = async ({
  meetingId,
  pageParam,
  pageSize,
  orderBy,
  adminApiParams,
}: GetMeetingParticipantsParams): Promise<
  ConnectedXMResponse<Participant[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/meetings/${meetingId}/participants`, {
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
export const useGetMeetingParticipants = (
  meetingId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetMeetingParticipants>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetMeetingParticipants>>
  >(
    MEETING_PARTICIPANTS_QUERY_KEY(meetingId),
    (params: InfiniteQueryParams) =>
      GetMeetingParticipants({ ...params, meetingId }),
    params,
    {
      ...options,
      enabled: !!meetingId && (options?.enabled ?? true),
    }
  );
};
