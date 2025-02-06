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
 * Endpoint to add a sponsor to a specific event track.
 * This function allows the addition of a sponsor to a designated track within an event,
 * facilitating the management of event sponsorships. It is designed for use in applications
 * that require dynamic updates to event track sponsorships.
 * @name AddEventTrackSponsor
 * @param {string} eventId (path) The id of the event
 * @param {string} trackId (path) The id of the track
 * @param {string} sponsorId (path) The id of the sponsor
 * @version 1.3
 **/
export interface AddEventTrackSponsorParams extends MutationParams {
  eventId: string;
  trackId: string;
  sponsorId: string;
}

export const AddEventTrackSponsor = async ({
  eventId,
  trackId,
  sponsorId,
  adminApiParams,
  queryClient,
}: AddEventTrackSponsorParams): Promise<ConnectedXMResponse<EventTrack>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventTrack>>(
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

export const useAddEventTrackSponsor = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventTrackSponsor>>,
      Omit<AddEventTrackSponsorParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventTrackSponsorParams,
    Awaited<ReturnType<typeof AddEventTrackSponsor>>
  >(AddEventTrackSponsor, options, {
    domain: "events",
    type: "update",
  });
};
