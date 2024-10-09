import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSession } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_SPEAKERS_QUERY_KEY,
  SET_EVENT_SESSION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sessions
 */
export interface RemoveEventSessionSpeakerParams extends MutationParams {
  eventId: string;
  sessionId: string;
  speakerId: string;
}

/**
 * @category Methods
 * @group Event-Sessions
 */
export const RemoveEventSessionSpeaker = async ({
  eventId,
  sessionId,
  speakerId,
  adminApiParams,
  queryClient,
}: RemoveEventSessionSpeakerParams): Promise<
  ConnectedXMResponse<EventSession>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete(
    `/events/${eventId}/sessions/${sessionId}/speakers/${speakerId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_SPEAKERS_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_QUERY_DATA(queryClient, [eventId, sessionId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sessions
 */
export const useRemoveEventSessionSpeaker = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSessionSpeaker>>,
      Omit<RemoveEventSessionSpeakerParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSessionSpeakerParams,
    Awaited<ReturnType<typeof RemoveEventSessionSpeaker>>
  >(RemoveEventSessionSpeaker, options, {
    domain: "events",
    type: "update",
  });
};
