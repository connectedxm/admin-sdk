import { GetAdminAPI } from "@src/AdminAPI";
import { EventSessionTime, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionTimeCreateInputs } from "@src/params";
import {
  EVENT_SESSION_TIMES_QUERY_KEY,
  SET_EVENT_SESSION_TIME_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface CreateEventSessionTimeParams extends MutationParams {
  eventId: string;
  sessionId: string;
  time: EventSessionTimeCreateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEventSessionTime = async ({
  eventId,
  sessionId,
  time,
  adminApiParams,
  queryClient,
}: CreateEventSessionTimeParams): Promise<
  ConnectedXMResponse<EventSessionTime>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSessionTime>
  >(`/events/${eventId}/sessions/${sessionId}/times`, time);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TIMES_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_TIME_QUERY_DATA(
      queryClient,
      [eventId, sessionId, data.data.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useCreateEventSessionTime = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSessionTime>>,
      Omit<CreateEventSessionTimeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionTimeParams,
    Awaited<ReturnType<typeof CreateEventSessionTime>>
  >(CreateEventSessionTime, options);
};
