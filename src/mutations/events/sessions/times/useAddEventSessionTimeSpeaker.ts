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
export interface AddEventSessionTimeSpeakerParams extends MutationParams {
  eventId: string;
  sessionId: string;
  timeId: string;
  speakerId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const AddEventSessionTimeSpeaker = async ({
  eventId,
  sessionId,
  timeId,
  speakerId,
  adminApiParams,
  queryClient,
}: AddEventSessionTimeSpeakerParams): Promise<
  ConnectedXMResponse<EventSessionTime>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
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
export const useAddEventSessionTimeSpeaker = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSessionTimeSpeaker>>,
      Omit<AddEventSessionTimeSpeakerParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSessionTimeSpeakerParams,
    Awaited<ReturnType<typeof AddEventSessionTimeSpeaker>>
  >(AddEventSessionTimeSpeaker, options);
};
