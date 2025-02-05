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
 * Endpoint to update an existing event with new details.
 * This function allows users to modify the details of an event by providing the event ID and the updated event inputs.
 * It ensures that the event data is refreshed in the query client upon successful update.
 * @name UpdateEvent
 * @param {string} eventId - The ID of the event to be updated
 * @param {EventUpdateInputs} event - The new inputs for updating the event
 * @version 1.2
 **/
export interface UpdateEventParams extends MutationParams {
  eventId: string;
  event: EventUpdateInputs;
}

export const UpdateEvent = async ({
  eventId,
  event,
  adminApiParams,
  queryClient,
}: UpdateEventParams): Promise<ConnectedXMResponse<Event>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Event>>(
    `/events/${eventId}`,
    event
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY() });
    SET_EVENT_QUERY_DATA(queryClient, [data.data?.id], data);
  }
  return data;
};

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
  >(UpdateEvent, options, {
    domain: "events",
    type: "update",
  });
};