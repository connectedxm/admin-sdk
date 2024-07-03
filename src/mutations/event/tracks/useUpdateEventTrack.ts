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
 * @category Params
 * @group Event-Tracks
 */
export interface UpdateEventTrackParams extends MutationParams {
  eventId: string;
  trackId: string;
  track: EventTrackUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Tracks
 */
export const UpdateEventTrack = async ({
  eventId,
  trackId,
  track,
  adminApiParams,
  queryClient,
}: UpdateEventTrackParams): Promise<ConnectedXMResponse<EventTrack>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventTrack>>(
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

/**
 * @category Mutations
 * @group Event-Tracks
 */
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
  >(UpdateEventTrack, options);
};
