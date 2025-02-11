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
 * Endpoint to create a new event track within a specified event.
 * This function allows users to add a new track to an event by providing the event ID and the necessary track creation inputs.
 * It is designed to be used in applications where event management and track creation are required.
 * @name CreateEventTrack
 * @param {string} eventId (path) The id of the event
 * @param {EventTrackCreateInputs} track (body) The inputs for creating the event track
 * @version 1.3
 **/

export interface CreateEventTrackParams extends MutationParams {
  eventId: string;
  track: EventTrackCreateInputs;
}

export const CreateEventTrack = async ({
  eventId,
  track,
  adminApiParams,
  queryClient,
}: CreateEventTrackParams): Promise<ConnectedXMResponse<EventTrack>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventTrack>>(
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
