import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSession } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_SPEAKERS_QUERY_KEY,
  SET_EVENT_SESSION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to add a speaker to a specific event session.
 * This function allows the addition of a speaker to a designated session within an event.
 * It is designed to be used in applications where managing event sessions and their speakers is required.
 * @name AddEventSessionSpeaker
 * @param {string} eventId (path) - The id of the event
 * @param {string} sessionId (path) - The id of the session
 * @param {string} speakerId (path) - The id of the speaker
 * @version 1.3
 **/
export interface AddEventSessionSpeakerParams extends MutationParams {
  eventId: string;
  sessionId: string;
  speakerId: string;
}

export const AddEventSessionSpeaker = async ({
  eventId,
  sessionId,
  speakerId,
  adminApiParams,
  queryClient,
}: AddEventSessionSpeakerParams): Promise<
  ConnectedXMResponse<EventSession>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions/${sessionId}/speakers/${speakerId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_SPEAKERS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_QUERY_DATA(queryClient, [eventId, sessionId], data);
  }
  return data;
};

export const useAddEventSessionSpeaker = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSessionSpeaker>>,
      Omit<AddEventSessionSpeakerParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSessionSpeakerParams,
    Awaited<ReturnType<typeof AddEventSessionSpeaker>>
  >(AddEventSessionSpeaker, options, {
    domain: "events",
    type: "update",
  });
};