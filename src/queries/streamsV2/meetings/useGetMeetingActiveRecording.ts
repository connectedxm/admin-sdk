import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, MeetingRecording } from "@src/interfaces";
import { MEETING_QUERY_KEY } from "./useGetMeeting";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_ACTIVE_RECORDING_QUERY_KEY = (meetingId: string) => [
  ...MEETING_QUERY_KEY(meetingId),
  "ACTIVE_RECORDING",
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_ACTIVE_RECORDING_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_ACTIVE_RECORDING_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingActiveRecording>>
) => {
  client.setQueryData(
    MEETING_ACTIVE_RECORDING_QUERY_KEY(...keyParams),
    response
  );
};

interface GetMeetingActiveRecordingParams extends SingleQueryParams {
  meetingId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingActiveRecording = async ({
  meetingId,
  adminApiParams,
}: GetMeetingActiveRecordingParams): Promise<
  ConnectedXMResponse<MeetingRecording>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/meetings/${meetingId}/recording`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeetingActiveRecording = (
  meetingId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetMeetingActiveRecording>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetMeetingActiveRecording>>(
    MEETING_ACTIVE_RECORDING_QUERY_KEY(meetingId),
    (params) => GetMeetingActiveRecording({ meetingId, ...params }),
    {
      ...options,
      enabled: !!meetingId && (options?.enabled ?? true),
    }
  );
};
