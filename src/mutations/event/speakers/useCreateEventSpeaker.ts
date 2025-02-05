import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSpeaker } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSpeakerCreateInputs } from "@src/params";
import {
  EVENT_SPEAKERS_QUERY_KEY,
  SET_EVENT_SPEAKER_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to create a new event speaker within a specified event.
 * This function allows the creation of a new speaker for an event by providing the event ID and speaker details.
 * It is designed to be used in applications where event management and speaker assignments are required.
 * @name CreateEventSpeaker
 * @param {string} eventId - The id of the event
 * @param {EventSpeakerCreateInputs} speaker - The inputs for creating an event speaker
 * @version 1.2
 **/
export interface CreateEventSpeakerParams extends MutationParams {
  eventId: string;
  speaker: EventSpeakerCreateInputs;
}

export const CreateEventSpeaker = async ({
  eventId,
  speaker,
  adminApiParams,
  queryClient,
}: CreateEventSpeakerParams): Promise<ConnectedXMResponse<EventSpeaker>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventSpeaker>>(
    `/events/${eventId}/speakers`,
    speaker
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPEAKERS_QUERY_KEY(eventId),
    });
    SET_EVENT_SPEAKER_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

export const useCreateEventSpeaker = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSpeaker>>,
      Omit<CreateEventSpeakerParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSpeakerParams,
    Awaited<ReturnType<typeof CreateEventSpeaker>>
  >(CreateEventSpeaker, options, {
    domain: "events",
    type: "update",
  });
};