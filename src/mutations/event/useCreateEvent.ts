import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Event } from "@src/interfaces";
import { EVENTS_QUERY_KEY, SET_EVENT_QUERY_DATA } from "@src/queries";
import { EventCreateInputs } from "@src/params";

/**
 * Endpoint to create a new event within the system.
 * This function allows for the creation of an event by providing the necessary event details.
 * It is designed to be used in applications where event management is required.
 * @name CreateEvent
 * @param {EventCreateInputs} event (body) - The event details to be created
 * @version 1.3
 **/
export interface CreateEventParams extends MutationParams {
  event: EventCreateInputs;
}

export const CreateEvent = async ({
  event,
  adminApiParams,
  queryClient,
}: CreateEventParams): Promise<ConnectedXMResponse<Event>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Event>>(
    `/events`,
    event
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY() });
    SET_EVENT_QUERY_DATA(queryClient, [data.data?.id], data);
  }
  return data;
};

export const useCreateEvent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEvent>>,
      Omit<CreateEventParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventParams,
    Awaited<ReturnType<typeof CreateEvent>>
  >(CreateEvent, options, {
    domain: "events",
    type: "create",
  });
};