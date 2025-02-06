import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Event } from "@src/interfaces";
import {
  SET_EVENT_QUERY_DATA,
  EVENTS_QUERY_KEY,
  UNAPPROVED_EVENTS_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to approve an event within the system.
 * This function allows administrators to approve events by providing the event ID.
 * It updates the event status and refreshes relevant queries to ensure data consistency.
 * @name ApproveEvent
 * @param {string} eventId (path) - The ID of the event to be approved
 * @version 1.3
 **/
export interface ApproveEventParams extends MutationParams {
  eventId: string;
}

export const ApproveEvent = async ({
  eventId,
  adminApiParams,
  queryClient,
}: ApproveEventParams): Promise<ConnectedXMResponse<Event>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Event>>(
    `/events/${eventId}/approve`
  );
  if (queryClient && data.status === "ok") {
    SET_EVENT_QUERY_DATA(queryClient, [data.data?.id], data);
    queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY() });
    queryClient.invalidateQueries({ queryKey: UNAPPROVED_EVENTS_QUERY_KEY() });
  }
  return data;
};

export const useApproveEvent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ApproveEvent>>,
      Omit<ApproveEventParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ApproveEventParams,
    Awaited<ReturnType<typeof ApproveEvent>>
  >(ApproveEvent, options, {
    domain: "events",
    type: "update",
  });
};