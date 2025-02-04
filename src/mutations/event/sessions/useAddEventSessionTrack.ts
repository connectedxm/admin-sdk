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
 * Endpoint to add a track to a specific event session.
 * This function allows users to associate a track with a particular session within an event.
 * It is useful for applications that manage event sessions and their respective tracks.
 * @name AddEventSessionTrack
 * @param {string} eventId - The id of the event
 * @param {string} sessionId - The id of the session
 * @param {string} trackId - The id of the track
 * @version 1.2
 **/
export interface AddEventSessionTrackParams extends MutationParams {
  eventId: string;
  sessionId: string;
  trackId: string;
}

export const AddEventSessionTrack = async ({
  eventId,
  sessionId,
  trackId,
  adminApiParams,
  queryClient,
}: AddEventSessionTrackParams): Promise<ConnectedXMResponse<EventSession>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventSession>>(
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

export const useAddEventSessionTrack = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSessionTrack>>,
      Omit<AddEventSessionTrackParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSessionTrackParams,
    Awaited<ReturnType<typeof AddEventSessionTrack>>
  >(AddEventSessionTrack, options, {
    domain: "events",
    type: "update",
  });
};