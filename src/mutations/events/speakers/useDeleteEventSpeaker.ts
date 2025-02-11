import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SPEAKERS_QUERY_KEY,
  EVENT_SPEAKER_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete a speaker from a specific event.
 * This function allows the removal of a speaker from an event by specifying the event and speaker IDs.
 * It is designed to be used in applications where event management and speaker coordination are required.
 * @name DeleteEventSpeaker
 * @param {string} eventId (path) The id of the event
 * @param {string} speakerId (path) The id of the speaker
 * @version 1.3
 **/

export interface DeleteEventSpeakerParams extends MutationParams {
  eventId: string;
  speakerId: string;
}

export const DeleteEventSpeaker = async ({
  eventId,
  speakerId,
  adminApiParams,
  queryClient,
}: DeleteEventSpeakerParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/speakers/${speakerId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPEAKERS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SPEAKER_QUERY_KEY(eventId, speakerId),
    });
  }
  return data;
};

export const useDeleteEventSpeaker = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSpeaker>>,
      Omit<DeleteEventSpeakerParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSpeakerParams,
    Awaited<ReturnType<typeof DeleteEventSpeaker>>
  >(DeleteEventSpeaker, options, {
    domain: "events",
    type: "update",
  });
};
