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
 * @category Params
 * @group Event-Speakers
 */
export interface UpdateEventSpeakerParams extends MutationParams {
  eventId: string;
  speakerId: string;
  speaker: EventSpeakerUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Speakers
 */
export const UpdateEventSpeaker = async ({
  eventId,
  speakerId,
  speaker,
  adminApiParams,
  queryClient,
}: UpdateEventSpeakerParams): Promise<ConnectedXMResponse<EventSpeaker>> => {
  if (!speakerId) throw new Error("speakerId is required");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventSpeaker>>(
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
};

/**
 * @category Mutations
 * @group Event-Speakers
 */
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
