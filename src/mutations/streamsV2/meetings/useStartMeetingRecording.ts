import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { Recording, ConnectedXMResponse } from "@src/interfaces";
import {
  MEETING_RECORDINGS_QUERY_KEY,
  SET_MEETING_RECORDING_QUERY_DATA,
} from "@src/queries";
import { MeetingRecordingCreateInputs } from "@src/params";

/**
 * @category Params
 * @group StreamsV2
 */
export interface StartMeetingRecordingParams extends MutationParams {
  meetingId: string;
  recording: MeetingRecordingCreateInputs;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const StartMeetingRecording = async ({
  meetingId,
  recording,
  adminApiParams,
  queryClient,
}: StartMeetingRecordingParams): Promise<ConnectedXMResponse<Recording>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Recording>>(
    `/streams/v2/meetings/${meetingId}/recording/start`,
    recording
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: MEETING_RECORDINGS_QUERY_KEY(meetingId),
    });
    SET_MEETING_RECORDING_QUERY_DATA(
      queryClient,
      [meetingId, data?.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useStartMeetingRecording = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof StartMeetingRecording>>,
      Omit<StartMeetingRecordingParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    StartMeetingRecordingParams,
    Awaited<ReturnType<typeof StartMeetingRecording>>
  >(StartMeetingRecording, options);
};
