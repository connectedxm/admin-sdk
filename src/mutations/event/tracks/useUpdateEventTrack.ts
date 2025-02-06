import { GetAdminAPI } from "@src/AdminAPI";
import { EventTrack, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventTrackUpdateInputs } from "@src/params";
import {
  EVENT_TRACKS_QUERY_KEY,
  SET_EVENT_TRACK_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update an existing event track.
 * This function allows users to modify the details of a specific track within an event by providing the event ID, track ID, and the updated track inputs.
 * It is designed to be used in applications where event track management is required.
 * @name UpdateEventTrack
 * @param {string} eventId (path) - The id of the event
 * @param {string} trackId (path) - The id of the track
 * @param {EventTrackUpdateInputs} track (body) - The track update inputs
 * @version 1.3
 **/
export interface UpdateEventTrackParams extends MutationParams {
  eventId: string;
  trackId: string;
  track: EventTrackUpdateInputs;
}

export const UpdateEventTrack = async ({
  eventId,
  trackId,
  track,
  adminApiParams,
  queryClient,
}: UpdateEventTrackParams): Promise<ConnectedXMResponse<EventTrack>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<EventTrack>>(
    `/events/${eventId}/tracks/${trackId}`,
    track
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TRACKS_QUERY_KEY(eventId),
    });
    SET_EVENT_TRACK_QUERY_DATA(queryClient, [eventId, trackId], data);
  }
  return data;
};

export const useUpdateEventTrack = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventTrack>>,
      Omit<UpdateEventTrackParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventTrackParams,
    Awaited<ReturnType<typeof UpdateEventTrack>>
  >(UpdateEventTrack, options, {
    domain: "events",
    type: "update",
  });
};