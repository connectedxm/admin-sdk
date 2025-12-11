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
import { MeetingParticipantCreateInputs } from "@src/params";

/**
 * @category Params
 * @group StreamsV2
 */
export interface CreateMeetingParticipantParams extends MutationParams {
  meetingId: string;
  participant: MeetingParticipantCreateInputs;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const CreateMeetingParticipant = async ({
  meetingId,
  participant,
  adminApiParams,
  queryClient,
}: CreateMeetingParticipantParams): Promise<
  ConnectedXMResponse<MeetingParticipant & { token: string }>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<MeetingParticipant & { token: string }>
  >(`/meetings/${meetingId}/participants`, participant);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: MEETING_PARTICIPANTS_QUERY_KEY(meetingId),
    });
    SET_MEETING_PARTICIPANT_QUERY_DATA(
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
export const useCreateMeetingParticipant = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateMeetingParticipant>>,
      Omit<CreateMeetingParticipantParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateMeetingParticipantParams,
    Awaited<ReturnType<typeof CreateMeetingParticipant>>
  >(CreateMeetingParticipant, options);
};
