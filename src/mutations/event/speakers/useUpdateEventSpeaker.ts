import { GetAdminAPI } from "@src/AdminAPI";
import { EventSpeaker, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSpeakerUpdateInputs } from "@src/params";
import {
  EVENT_SPEAKERS_QUERY_KEY,
  SET_EVENT_SPEAKER_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update the details of a specific event speaker.
 * This function allows updating the information of an event speaker by providing the event ID, speaker ID, and the updated speaker details.
 * It is designed to be used in applications where event management and speaker details modification are required.
 * @name UpdateEventSpeaker
 * @param {string} eventId (path) - The id of the event
 * @param {string} speakerId (path) - The id of the speaker
 * @param {EventSpeakerUpdateInputs} speaker (body) - The details of the speaker to update
 * @version 1.3
 **/

export interface UpdateEventSpeakerParams extends MutationParams {
  eventId: string;
  speakerId: string;
  speaker: EventSpeakerUpdateInputs;
}

export const UpdateEventSpeaker = async ({
  eventId,
  speakerId,
  speaker,
  adminApiParams,
  queryClient,
}: UpdateEventSpeakerParams): Promise<ConnectedXMResponse<EventSpeaker>> => {
  if (!speakerId) throw new Error("speakerId is required");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<EventSpeaker>>(
    `/events/${eventId}/speakers/${speakerId}`,
    {
      ...speaker,
      id: undefined,
      eventId: undefined,
      event: undefined,
      fullName: undefined,
      image: undefined,
      sessions: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPEAKERS_QUERY_KEY(eventId),
    });
    SET_EVENT_SPEAKER_QUERY_DATA(
      queryClient,
      [eventId, speakerId || data.data.id],
      data
    );
  }
  return data;
}

export const useUpdateEventSpeaker = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSpeaker>>,
      Omit<UpdateEventSpeakerParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSpeakerParams,
    Awaited<ReturnType<typeof UpdateEventSpeaker>>
  >(UpdateEventSpeaker, options, {
    domain: "events",
    type: "update",
  });
};