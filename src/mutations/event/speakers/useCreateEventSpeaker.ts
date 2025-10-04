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
 * @category Params
 * @group Event-Speakers
 */
export interface CreateEventSpeakerParams extends MutationParams {
  eventId: string;
  speaker: EventSpeakerCreateInputs;
}

/**
 * @category Methods
 * @group Event-Speakers
 */
export const CreateEventSpeaker = async ({
  eventId,
  speaker,
  adminApiParams,
  queryClient,
}: CreateEventSpeakerParams): Promise<ConnectedXMResponse<EventSpeaker>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventSpeaker>>(
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

/**
 * @category Mutations
 * @group Event-Speakers
 */
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
  >(CreateEventSpeaker, options);
};
