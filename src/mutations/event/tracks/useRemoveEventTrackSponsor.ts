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
export interface RemoveEventTrackSponsorParams extends MutationParams {
  eventId: string;
  trackId: string;
  sponsorId: string;
}

/**
 * @category Methods
 * @group Event-Tracks
 */
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

/**
 * @category Mutations
 * @group Event-Tracks
 */
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
