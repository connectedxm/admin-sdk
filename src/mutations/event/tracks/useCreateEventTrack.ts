import { GetAdminAPI } from "@src/AdminAPI";
import { EventTrack, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventTrackCreateInputs } from "@src/params";
import {
  EVENT_TRACKS_QUERY_KEY,
  SET_EVENT_TRACK_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Tracks
 */
export interface CreateEventTrackParams extends MutationParams {
  eventId: string;
  track: EventTrackCreateInputs;
}

/**
 * @category Methods
 * @group Event-Tracks
 */
export const CreateEventTrack = async ({
  eventId,
  track,

  adminApiParams,
  queryClient,
}: CreateEventTrackParams): Promise<ConnectedXMResponse<EventTrack>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventTrack>>(
    `/events/${eventId}/tracks`,
    track
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TRACKS_QUERY_KEY(eventId),
    });
    SET_EVENT_TRACK_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Tracks
 */
export const useCreateEventTrack = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventTrack>>,
      Omit<CreateEventTrackParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventTrackParams,
    Awaited<ReturnType<typeof CreateEventTrack>>
  >(CreateEventTrack, options, {
    domain: "events",
    type: "update",
  });
};
