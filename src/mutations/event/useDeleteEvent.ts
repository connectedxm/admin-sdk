import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENTS_QUERY_KEY, EVENT_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific event by its unique identifier.
 * This function allows administrators to remove an event from the system, ensuring that all related queries are invalidated and removed.
 * It is designed for use in applications where event management and cleanup are required.
 * @name DeleteEvent
 * @param {string} eventId (path) - The id of the event
 * @version 1.3
**/
export interface DeleteEventParams extends MutationParams {
  eventId: string;
}

export const DeleteEvent = async ({
  eventId,
  adminApiParams,
  queryClient,
}: DeleteEventParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: EVENT_QUERY_KEY(eventId) });
  }
  return data;
};

export const useDeleteEvent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEvent>>,
      Omit<DeleteEventParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventParams,
    Awaited<ReturnType<typeof DeleteEvent>>
  >(DeleteEvent, options, {
    domain: "events",
    type: "del",
  });
};