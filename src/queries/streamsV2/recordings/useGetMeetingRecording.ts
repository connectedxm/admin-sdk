import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, MeetingRecording } from "@src/interfaces";
import { MEETING_RECORDINGS_QUERY_KEY } from "./useGetMeetingRecordings";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_RECORDING_QUERY_KEY = (
  meetingId: string,
  recordingId: string
) => [...MEETING_RECORDINGS_QUERY_KEY(meetingId), recordingId];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_RECORDING_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_RECORDING_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingRecording>>
) => {
  client.setQueryData(MEETING_RECORDING_QUERY_KEY(...keyParams), response);
};

interface GetMeetingRecordingParams extends SingleQueryParams {
  meetingId: string;
  recordingId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingRecording = async ({
  meetingId,
  recordingId,
  adminApiParams,
}: GetMeetingRecordingParams): Promise<
  ConnectedXMResponse<MeetingRecording>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/meetings/${meetingId}/recordings/${recordingId}`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeetingRecording = (
  meetingId: string = "",
  recordingId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetMeetingRecording>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetMeetingRecording>>(
    MEETING_RECORDING_QUERY_KEY(meetingId, recordingId),
    (params) => GetMeetingRecording({ meetingId, recordingId, ...params }),
    {
      ...options,
      enabled: !!meetingId && !!recordingId && (options?.enabled ?? true),
    }
  );
};
