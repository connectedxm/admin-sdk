import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MEETING_PARTICIPANTS_QUERY_KEY,
  MEETING_PARTICIPANT_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group StreamsV2
 */
export interface DeleteMeetingParticipantParams extends MutationParams {
  meetingId: string;
  participantId: string;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const DeleteMeetingParticipant = async ({
  meetingId,
  participantId,
  adminApiParams,
  queryClient,
}: DeleteMeetingParticipantParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/streams/v2/meetings/${meetingId}/participants/${participantId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: MEETING_PARTICIPANTS_QUERY_KEY(meetingId),
    });
    queryClient.removeQueries({
      queryKey: MEETING_PARTICIPANT_QUERY_KEY(meetingId, participantId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useDeleteMeetingParticipant = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteMeetingParticipant>>,
      Omit<DeleteMeetingParticipantParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteMeetingParticipantParams,
    Awaited<ReturnType<typeof DeleteMeetingParticipant>>
  >(DeleteMeetingParticipant, options);
};
