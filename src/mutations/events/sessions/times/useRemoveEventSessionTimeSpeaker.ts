import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionTime } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_TIME_SPEAKERS_QUERY_KEY,
  EVENT_SESSION_TIMES_QUERY_KEY,
  SET_EVENT_SESSION_TIME_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface RemoveEventSessionTimeSpeakerParams extends MutationParams {
  eventId: string;
  sessionId: string;
  timeId: string;
  speakerId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const RemoveEventSessionTimeSpeaker = async ({
  eventId,
  sessionId,
  timeId,
  speakerId,
  adminApiParams,
  queryClient,
}: RemoveEventSessionTimeSpeakerParams): Promise<
  ConnectedXMResponse<EventSessionTime>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<EventSessionTime>
  >(
    `/events/${eventId}/sessions/${sessionId}/times/${timeId}/speakers/${speakerId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TIME_SPEAKERS_QUERY_KEY(
        eventId,
        sessionId,
        timeId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TIMES_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_TIME_QUERY_DATA(
      queryClient,
      [eventId, sessionId, timeId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useRemoveEventSessionTimeSpeaker = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSessionTimeSpeaker>>,
      Omit<
        RemoveEventSessionTimeSpeakerParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSessionTimeSpeakerParams,
    Awaited<ReturnType<typeof RemoveEventSessionTimeSpeaker>>
  >(RemoveEventSessionTimeSpeaker, options);
};
