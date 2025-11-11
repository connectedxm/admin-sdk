import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, Livestream } from "@src/interfaces";
import { MEETING_QUERY_KEY } from "./useGetMeeting";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_LIVESTREAM_QUERY_KEY = (meetingId: string) => [
  ...MEETING_QUERY_KEY(meetingId),
  "LIVESTREAM",
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_LIVESTREAM_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_LIVESTREAM_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingLivestream>>
) => {
  client.setQueryData(MEETING_LIVESTREAM_QUERY_KEY(...keyParams), response);
};

interface GetMeetingLivestreamParams extends SingleQueryParams {
  meetingId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingLivestream = async ({
  meetingId,
  adminApiParams,
}: GetMeetingLivestreamParams): Promise<ConnectedXMResponse<Livestream>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/meetings/${meetingId}/livestream`);

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeetingLivestream = (
  meetingId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetMeetingLivestream>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetMeetingLivestream>>(
    MEETING_LIVESTREAM_QUERY_KEY(meetingId),
    (params) => GetMeetingLivestream({ meetingId, ...params }),
    {
      ...options,
      enabled: !!meetingId && (options?.enabled ?? true),
    }
  );
};
