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
 * Endpoint to add a session for a specific event speaker.
 * This function allows the addition of a session to an event speaker's schedule by specifying the event, speaker, and session IDs.
 * It is designed to be used in applications where managing event speaker sessions is required.
 * @name AddEventSpeakerSession
 * @param {string} eventId (path) The id of the event
 * @param {string} speakerId (path) The id of the speaker
 * @param {string} sessionId (path) The id of the session
 * @version 1.3
 **/

export interface AddEventSpeakerSessionParams extends MutationParams {
  eventId: string;
  speakerId: string;
  sessionId: string;
}

export const AddEventSpeakerSession = async ({
  eventId,
  speakerId,
  sessionId,
  adminApiParams,
  queryClient,
}: AddEventSpeakerSessionParams): Promise<
  ConnectedXMResponse<EventSpeaker>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventSpeaker>>(
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
  >(AddEventSpeakerSession, options, {
    domain: "events",
    type: "update",
  });
};
