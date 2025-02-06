import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAttendee } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ATTENDEES_QUERY_KEY,
  SET_EVENT_ATTENDEE_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to create a new event attendee.
 * This function allows the creation of a new attendee for a specified event by providing the event ID and account ID.
 * It is designed to be used in applications where managing event attendees is required.
 * @name CreateEventAttendee
 * @param {string} eventId (path) - The id of the event
 * @param {string} accountId (bodyValue) - The id of the account
 * @version 1.3
 **/

export interface CreateEventAttendeeParams extends MutationParams {
  eventId: string;
  accountId: string;
}

export const CreateEventAttendee = async ({
  eventId,
  accountId,
  adminApiParams,
  queryClient,
}: CreateEventAttendeeParams): Promise<ConnectedXMResponse<EventAttendee>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventAttendee>>(
    `/events/${eventId}/attendees`,
    {
      accountId,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEES_QUERY_KEY(eventId),
    });
    SET_EVENT_ATTENDEE_QUERY_DATA(queryClient, [eventId, accountId], data);
  }
  return data;
};

export const useCreateEventAttendee = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventAttendee>>,
      Omit<CreateEventAttendeeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventAttendeeParams,
    Awaited<ReturnType<typeof CreateEventAttendee>>
  >(CreateEventAttendee, options, {
    domain: "events",
    type: "update",
  });
};