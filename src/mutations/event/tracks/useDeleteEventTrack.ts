import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_TRACKS_QUERY_KEY, EVENT_TRACK_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific event track within an event.
 * This function allows for the removal of a track from an event by specifying the event and track IDs.
 * It is designed to be used in applications where event management and track deletion are required.
 * @name DeleteEventTrack
 * @param {string} eventId (path) - The id of the event
 * @param {string} trackId (path) - The id of the track
 * @version 1.3
 **/

export interface DeleteEventTrackParams extends MutationParams {
  eventId: string;
  trackId: string;
}

export const DeleteEventTrack = async ({
  eventId,
  trackId,
  adminApiParams,
  queryClient,
}: DeleteEventTrackParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/tracks/${trackId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TRACKS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_TRACK_QUERY_KEY(eventId, trackId),
    });
  }
  return data;
};

export const useDeleteEventTrack = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventTrack>>,
      Omit<DeleteEventTrackParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventTrackParams,
    Awaited<ReturnType<typeof DeleteEventTrack>>
  >(DeleteEventTrack, options, {
    domain: "events",
    type: "update",
  });
};