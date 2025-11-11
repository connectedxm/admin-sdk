import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { Participant, ConnectedXMResponse } from "@src/interfaces";
import {
  MEETING_PARTICIPANTS_QUERY_KEY,
  SET_MEETING_PARTICIPANT_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group StreamsV2
 */
export interface RegenerateMeetingParticipantTokenParams
  extends MutationParams {
  meetingId: string;
  participantId: string;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const RegenerateMeetingParticipantToken = async ({
  meetingId,
  participantId,
  adminApiParams,
  queryClient,
}: RegenerateMeetingParticipantTokenParams): Promise<
  ConnectedXMResponse<Participant>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Participant>>(
    `/meetings/${meetingId}/participants/${participantId}/regenerate`
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
export const useRegenerateMeetingParticipantToken = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RegenerateMeetingParticipantToken>>,
      Omit<
        RegenerateMeetingParticipantTokenParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RegenerateMeetingParticipantTokenParams,
    Awaited<ReturnType<typeof RegenerateMeetingParticipantToken>>
  >(RegenerateMeetingParticipantToken, options);
};
