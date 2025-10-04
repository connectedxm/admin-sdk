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
 * @category Params
 * @group Event
 */
export interface CreateEventParams extends MutationParams {
  event: EventCreateInputs;
}

/**
 * @category Methods
 * @group Event
 */
export const CreateEvent = async ({
  event,
  adminApiParams,
  queryClient,
}: CreateEventParams): Promise<ConnectedXMResponse<Event>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Event>>(
    `/events`,
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
  >(CreateEvent, options);
};
