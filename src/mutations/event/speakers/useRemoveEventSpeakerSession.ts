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
 * Endpoint to remove a session for a specific speaker at an event.
 * This function allows the removal of a session associated with a particular speaker at a given event.
 * It is designed to be used in scenarios where session management for event speakers is required.
 * @name RemoveEventSpeakerSession
 * @param {string} eventId - The id of the event
 * @param {string} speakerId - The id of the speaker
 * @param {string} sessionId - The id of the session
 * @version 1.2
 **/
export interface RemoveEventSpeakerSessionParams extends MutationParams {
  eventId: string;
  speakerId: string;
  sessionId: string;
}

export const RemoveEventSpeakerSession = async ({
  eventId,
  speakerId,
  sessionId,
  adminApiParams,
  queryClient,
}: RemoveEventSpeakerSessionParams): Promise<
  ConnectedXMResponse<EventSpeaker>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<EventSpeaker>>(
    `/events/${eventId}/speakers/${speakerId}/sessions/${sessionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPEAKER_SESSIONS_QUERY_KEY(eventId, speakerId),
    });
    SET_EVENT_SPEAKER_QUERY_DATA(queryClient, [eventId, speakerId], data);
  }
  return data;
}

export const useRemoveEventSpeakerSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSpeakerSession>>,
      Omit<RemoveEventSpeakerSessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSpeakerSessionParams,
    Awaited<ReturnType<typeof RemoveEventSpeakerSession>>
  >(RemoveEventSpeakerSession, options, {
    domain: "events",
    type: "update",
  });
};