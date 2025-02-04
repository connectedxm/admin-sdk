import { GetAdminAPI } from "@src/AdminAPI";
import { EventAttendee, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventAttendeeUpdateInputs } from "@src/params";
import {
  SET_EVENT_ATTENDEE_QUERY_DATA,
  EVENT_ATTENDEES_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to update the registration details of an event attendee.
 * This function allows updating the registration information for a specific attendee of an event.
 * It is designed to be used in applications where event management and attendee updates are required.
 * @name UpdateEventAttendee
 * @param {string} eventId - The id of the event
 * @param {string} accountId - The id of the account
 * @param {EventAttendeeUpdateInputs} registration - The registration details to update
 * @version 1.2
 **/

export interface UpdateEventAttendeeParams extends MutationParams {
  eventId: string;
  accountId: string;
  registration: EventAttendeeUpdateInputs;
}

export const UpdateEventAttendee = async ({
  eventId,
  accountId,
  registration,
  adminApiParams,
  queryClient,
}: UpdateEventAttendeeParams): Promise<ConnectedXMResponse<EventAttendee>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put(
    `/events/${eventId}/attendees/${accountId}`,
    registration
  );
  if (queryClient && data.status === "ok") {
    SET_EVENT_ATTENDEE_QUERY_DATA(queryClient, [eventId, accountId], data);
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEES_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useUpdateEventAttendee = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventAttendee>>,
      Omit<UpdateEventAttendeeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventAttendeeParams,
    Awaited<ReturnType<typeof UpdateEventAttendee>>
  >(UpdateEventAttendee, options, {
    domain: "events",
    type: "update",
  });
};