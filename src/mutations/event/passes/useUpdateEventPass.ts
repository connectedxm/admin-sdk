import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventPassUpdateInputs } from "@src/params";
import {
  EVENT_ATTENDEE_PASSES_QUERY_KEY,
  EVENT_ATTENDEE_QUERY_KEY,
  EVENT_PASSES_QUERY_KEY,
  EVENT_PASS_TYPE_PASSES_QUERY_KEY,
  SET_EVENT_PASS_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update an event pass with new details.
 * This function allows updating the details of a specific event pass by providing the event ID, pass ID, and the new pass details.
 * It is used in scenarios where event pass information needs to be modified, ensuring that the latest data is reflected in the system.
 * @name UpdateEventPass
 * @param {string} eventId - The id of the event
 * @param {string} passId - The id of the pass
 * @param {EventPassUpdateInputs} pass - The pass update inputs
 * @version 1.2
**/
export interface UpdateEventPassParams extends MutationParams {
  eventId: string;
  passId: string;
  pass: EventPassUpdateInputs;
}

export const UpdateEventPass = async ({
  eventId,
  passId,
  pass,
  adminApiParams,
  queryClient,
}: UpdateEventPassParams): Promise<ConnectedXMResponse<EventPass>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<EventPass>>(
    `/events/${eventId}/passes/${passId}`,
    pass
  );
  if (queryClient && data.status === "ok") {
    if (data.data.ticketId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_PASS_TYPE_PASSES_QUERY_KEY(eventId, data.data.ticketId),
      });
    }
    if (data.data.attendee.accountId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_ATTENDEE_QUERY_KEY(
          eventId,
          data.data.attendee.accountId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: EVENT_ATTENDEE_PASSES_QUERY_KEY(
          eventId,
          data.data.attendee.accountId
        ),
      });
    }
    queryClient.invalidateQueries({
      queryKey: EVENT_PASSES_QUERY_KEY(eventId),
    });
    SET_EVENT_PASS_QUERY_DATA(queryClient, [eventId, passId], data);
  }
  return data;
};

export const useUpdateEventPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventPass>>,
      Omit<UpdateEventPassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPassParams,
    Awaited<ReturnType<typeof UpdateEventPass>>
  >(UpdateEventPass, options, {
    domain: "events",
    type: "update",
  });
};