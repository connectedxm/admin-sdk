import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventTrack } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_TRACK_SPONSORS_QUERY_KEY,
  SET_EVENT_TRACK_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to remove a sponsor from a specific event track.
 * This function allows the removal of a sponsor from an event track by specifying the event, track, and sponsor IDs.
 * It is designed to be used in applications where managing event sponsorships is required.
 * @name RemoveEventTrackSponsor
 * @param {string} eventId (path) The id of the event
 * @param {string} trackId (path) The id of the track
 * @param {string} sponsorId (path) The id of the sponsor
 * @version 1.3
 **/

export interface RemoveEventTrackSponsorParams extends MutationParams {
  eventId: string;
  trackId: string;
  sponsorId: string;
}

export const RemoveEventTrackSponsor = async ({
  eventId,
  trackId,
  sponsorId,
  adminApiParams,
  queryClient,
}: RemoveEventTrackSponsorParams): Promise<ConnectedXMResponse<EventTrack>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<EventTrack>>(
    `/events/${eventId}/tracks/${trackId}/sponsors/${sponsorId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TRACK_SPONSORS_QUERY_KEY(eventId, trackId),
    });
    SET_EVENT_TRACK_QUERY_DATA(queryClient, [eventId, trackId], data);
  }
  return data;
};

export const useRemoveEventTrackSponsor = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventTrackSponsor>>,
      Omit<RemoveEventTrackSponsorParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventTrackSponsorParams,
    Awaited<ReturnType<typeof RemoveEventTrackSponsor>>
  >(RemoveEventTrackSponsor, options, {
    domain: "events",
    type: "update",
  });
};
