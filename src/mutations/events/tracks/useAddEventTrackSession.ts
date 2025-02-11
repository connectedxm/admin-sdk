import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventTrack } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_TRACK_SESSIONS_QUERY_KEY,
  SET_EVENT_TRACK_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to add a session to a specific event track.
 * This function allows users to associate a session with a particular track within an event.
 * It is designed to be used in applications where event management and session tracking are required.
 * @name AddEventTrackSession
 * @param {string} eventId (path) The id of the event
 * @param {string} trackId (path) The id of the track
 * @param {string} sessionId (path) The id of the session
 * @version 1.3
 **/
export interface AddEventTrackSessionParams extends MutationParams {
  eventId: string;
  trackId: string;
  sessionId: string;
}

export const AddEventTrackSession = async ({
  eventId,
  trackId,
  sessionId,
  adminApiParams,
  queryClient,
}: AddEventTrackSessionParams): Promise<ConnectedXMResponse<EventTrack>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventTrack>>(
    `/events/${eventId}/tracks/${trackId}/sessions/${sessionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TRACK_SESSIONS_QUERY_KEY(eventId, trackId),
    });
    SET_EVENT_TRACK_QUERY_DATA(queryClient, [eventId, trackId], data);
  }
  return data;
};

export const useAddEventTrackSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventTrackSession>>,
      Omit<AddEventTrackSessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventTrackSessionParams,
    Awaited<ReturnType<typeof AddEventTrackSession>>
  >(AddEventTrackSession, options, {
    domain: "events",
    type: "update",
  });
};
