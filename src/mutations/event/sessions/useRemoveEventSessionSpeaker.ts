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
 * Endpoint to remove a speaker from a specific event session.
 * This function allows the removal of a speaker from a designated session within an event, 
 * ensuring that the session's speaker list is updated accordingly.
 * It is intended for use in administrative contexts where event session management is required.
 * @name RemoveEventSessionSpeaker
 * @param {string} eventId - The id of the event
 * @param {string} sessionId - The id of the session
 * @param {string} speakerId - The id of the speaker
 * @version 1.2
 **/

export interface RemoveEventSessionSpeakerParams extends MutationParams {
  eventId: string;
  sessionId: string;
  speakerId: string;
}

export const RemoveEventSessionSpeaker = async ({
  eventId,
  sessionId,
  speakerId,
  adminApiParams,
  queryClient,
}: RemoveEventSessionSpeakerParams): Promise<
  ConnectedXMResponse<EventSession>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete(
    `/events/${eventId}/sessions/${sessionId}/speakers/${speakerId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_SPEAKERS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_QUERY_DATA(queryClient, [eventId, sessionId], data);
  }
  return data;
}

export const useRemoveEventSessionSpeaker = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSessionSpeaker>>,
      Omit<RemoveEventSessionSpeakerParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSessionSpeakerParams,
    Awaited<ReturnType<typeof RemoveEventSessionSpeaker>>
  >(RemoveEventSessionSpeaker, options, {
    domain: "events",
    type: "update",
  });
};