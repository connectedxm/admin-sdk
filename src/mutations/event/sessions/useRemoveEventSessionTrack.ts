import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSession } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_TRACKS_QUERY_KEY,
  SET_EVENT_SESSION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to remove a track from a specific event session.
 * This function allows the removal of a track from an event session by specifying the event, session, and track IDs.
 * It is used in scenarios where tracks need to be dynamically managed within event sessions.
 * @name RemoveEventSessionTrack
 * @param {string} eventId (path) - The id of the event
 * @param {string} sessionId (path) - The id of the session
 * @param {string} trackId (path) - The id of the track
 * @version 1.3
 **/
export interface RemoveEventSessionTrackParams extends MutationParams {
  eventId: string;
  sessionId: string;
  trackId: string;
}

export const RemoveEventSessionTrack = async ({
  eventId,
  sessionId,
  trackId,
  adminApiParams,
  queryClient,
}: RemoveEventSessionTrackParams): Promise<
  ConnectedXMResponse<EventSession>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<EventSession>>(
    `/events/${eventId}/sessions/${sessionId}/tracks/${trackId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TRACKS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_QUERY_DATA(queryClient, [eventId, sessionId], data);
  }
  return data;
};

export const useRemoveEventSessionTrack = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSessionTrack>>,
      Omit<RemoveEventSessionTrackParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSessionTrackParams,
    Awaited<ReturnType<typeof RemoveEventSessionTrack>>
  >(RemoveEventSessionTrack, options, {
    domain: "events",
    type: "update",
  });
};