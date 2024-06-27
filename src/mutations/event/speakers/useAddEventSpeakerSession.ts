import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSpeaker } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SPEAKER_SESSIONS_QUERY_KEY,
  SET_EVENT_SPEAKER_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Speakers
 */
export interface AddEventSpeakerSessionParams extends MutationParams {
  eventId: string;
  speakerId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Event-Speakers
 */
export const AddEventSpeakerSession = async ({
  eventId,
  speakerId,
  sessionId,
  adminApiParams,
  queryClient,
}: AddEventSpeakerSessionParams): Promise<
  ConnectedXMResponse<EventSpeaker>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventSpeaker>>(
    `/events/${eventId}/speakers/${speakerId}/sessions/${sessionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPEAKER_SESSIONS_QUERY_KEY(eventId, speakerId),
    });
    SET_EVENT_SPEAKER_QUERY_DATA(queryClient, [eventId, speakerId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Speakers
 */
export const useAddEventSpeakerSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSpeakerSession>>,
      Omit<AddEventSpeakerSessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSpeakerSessionParams,
    Awaited<ReturnType<typeof AddEventSpeakerSession>>
  >(AddEventSpeakerSession, options);
};
