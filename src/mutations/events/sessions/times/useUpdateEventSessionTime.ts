import { GetAdminAPI } from "@src/AdminAPI";
import { EventSessionTime, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSessionTimeUpdateInputs } from "@src/params";
import {
  EVENT_SESSION_TIMES_QUERY_KEY,
  SET_EVENT_SESSION_TIME_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionTimeParams extends MutationParams {
  eventId: string;
  sessionId: string;
  timeId: string;
  time: EventSessionTimeUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionTime = async ({
  eventId,
  sessionId,
  timeId,
  time,
  adminApiParams,
  queryClient,
}: UpdateEventSessionTimeParams): Promise<
  ConnectedXMResponse<EventSessionTime>
> => {
  if (!timeId) throw new Error("Time ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSessionTime>
  >(`/events/${eventId}/sessions/${sessionId}/times/${timeId}`, time);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_TIMES_QUERY_KEY(eventId, sessionId),
    });
    SET_EVENT_SESSION_TIME_QUERY_DATA(
      queryClient,
      [eventId, sessionId, timeId || data.data?.id.toString()],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventSessionTime = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionTime>>,
      Omit<UpdateEventSessionTimeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionTimeParams,
    Awaited<ReturnType<typeof UpdateEventSessionTime>>
  >(UpdateEventSessionTime, options);
};
