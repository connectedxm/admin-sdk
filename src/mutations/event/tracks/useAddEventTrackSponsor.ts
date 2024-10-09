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
 * @category Params
 * @group Event-Tracks
 */
export interface AddEventTrackSponsorParams extends MutationParams {
  eventId: string;
  trackId: string;
  sponsorId: string;
}

/**
 * @category Methods
 * @group Event-Tracks
 */
export const AddEventTrackSponsor = async ({
  eventId,
  trackId,
  sponsorId,
  adminApiParams,
  queryClient,
}: AddEventTrackSponsorParams): Promise<ConnectedXMResponse<EventTrack>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventTrack>>(
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

/**
 * @category Mutations
 * @group Event-Tracks
 */
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
