import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { MeetingParticipant, ConnectedXMResponse } from "@src/interfaces";
import {
  MEETING_PARTICIPANTS_QUERY_KEY,
  SET_MEETING_PARTICIPANT_QUERY_DATA,
} from "@src/queries";
import { MeetingParticipantUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group StreamsV2
 */
export interface UpdateMeetingParticipantParams extends MutationParams {
  meetingId: string;
  participantId: string;
  participant: MeetingParticipantUpdateInputs;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const UpdateMeetingParticipant = async ({
  meetingId,
  participantId,
  participant,
  adminApiParams,
  queryClient,
}: UpdateMeetingParticipantParams): Promise<
  ConnectedXMResponse<MeetingParticipant>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.patch<
    ConnectedXMResponse<MeetingParticipant>
  >(
    `/streams/v2/meetings/${meetingId}/participants/${participantId}`,
    participant
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: MEETING_PARTICIPANTS_QUERY_KEY(meetingId),
    });
    SET_MEETING_PARTICIPANT_QUERY_DATA(
      queryClient,
      [meetingId, participantId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useUpdateMeetingParticipant = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateMeetingParticipant>>,
      Omit<UpdateMeetingParticipantParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateMeetingParticipantParams,
    Awaited<ReturnType<typeof UpdateMeetingParticipant>>
  >(UpdateMeetingParticipant, options);
};
