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
export const MEETING_RECORDING_QUERY_KEY = (recordingId: string) => [
  ...MEETING_RECORDINGS_QUERY_KEY(),
  recordingId,
];

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
  recordingId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingRecording = async ({
  recordingId,
  adminApiParams,
}: GetMeetingRecordingParams): Promise<
  ConnectedXMResponse<MeetingRecording>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/v2/recordings/${recordingId}`);

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeetingRecording = (
  recordingId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetMeetingRecording>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetMeetingRecording>>(
    MEETING_RECORDING_QUERY_KEY(recordingId),
    (params) => GetMeetingRecording({ recordingId, ...params }),
    {
      ...options,
      enabled: !!recordingId && (options?.enabled ?? true),
    }
  );
};
