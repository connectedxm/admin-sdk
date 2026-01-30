import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { EVENTS_QUERY_KEY, SET_EVENT_QUERY_DATA } from "@src/queries";
import { ConnectedXMResponse, Event } from "@src/interfaces";
import { EventUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Event
 */
export interface UpdateEventParams extends MutationParams {
  eventId: string;
  event: EventUpdateInputs;
}

/**
 * @category Methods
 * @group Event
 */
export const UpdateEvent = async ({
  eventId,
  event,
  adminApiParams,
  queryClient,
}: UpdateEventParams): Promise<ConnectedXMResponse<Event>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Event>>(
    `/events/${eventId}`,
    event
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY() });
    SET_EVENT_QUERY_DATA(queryClient, [data.data?.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event
 */
export const useUpdateEvent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEvent>>,
      Omit<UpdateEventParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventParams,
    Awaited<ReturnType<typeof UpdateEvent>>
  >(UpdateEvent, options);
};
