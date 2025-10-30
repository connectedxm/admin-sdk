import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { MeetingRecording, ConnectedXMResponse } from "@src/interfaces";
import {
  MEETING_RECORDINGS_QUERY_KEY,
  SET_MEETING_RECORDING_QUERY_DATA,
} from "@src/queries";
import { MeetingRecordingUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group StreamsV2
 */
export interface UpdateMeetingRecordingParams extends MutationParams {
  meetingId: string;
  recordingId: string;
  recording: MeetingRecordingUpdateInputs;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const UpdateMeetingRecording = async ({
  meetingId,
  recordingId,
  recording,
  adminApiParams,
  queryClient,
}: UpdateMeetingRecordingParams): Promise<
  ConnectedXMResponse<MeetingRecording>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<MeetingRecording>>(
    `/streams/v2/meetings/${meetingId}/recordings/${recordingId}`,
    recording
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: MEETING_RECORDINGS_QUERY_KEY(meetingId),
    });
    SET_MEETING_RECORDING_QUERY_DATA(
      queryClient,
      [meetingId, recordingId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useUpdateMeetingRecording = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateMeetingRecording>>,
      Omit<UpdateMeetingRecordingParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateMeetingRecordingParams,
    Awaited<ReturnType<typeof UpdateMeetingRecording>>
  >(UpdateMeetingRecording, options);
};
