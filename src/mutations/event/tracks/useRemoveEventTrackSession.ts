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
 * Endpoint to remove a session from a specific event track.
 * This function allows the removal of a session from an event track by specifying the event, track, and session IDs.
 * It is used in scenarios where sessions need to be dynamically managed within event tracks.
 * @name RemoveEventTrackSession
 * @param {string} eventId (path) The id of the event
 * @param {string} trackId (path) The id of the track
 * @param {string} sessionId (path) The id of the session
 * @version 1.3
 **/
export interface RemoveEventTrackSessionParams extends MutationParams {
  eventId: string;
  trackId: string;
  sessionId: string;
}

export const RemoveEventTrackSession = async ({
  eventId,
  trackId,
  sessionId,
  adminApiParams,
  queryClient,
}: RemoveEventTrackSessionParams): Promise<ConnectedXMResponse<EventTrack>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<EventTrack>>(
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

export const useRemoveEventTrackSession = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventTrackSession>>,
      Omit<RemoveEventTrackSessionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventTrackSessionParams,
    Awaited<ReturnType<typeof RemoveEventTrackSession>>
  >(RemoveEventTrackSession, options, {
    domain: "events",
    type: "update",
  });
};
