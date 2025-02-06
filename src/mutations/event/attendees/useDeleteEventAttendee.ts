import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAttendee } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ATTENDEES_QUERY_KEY,
  EVENT_ATTENDEE_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete an attendee from a specific event.
 * This function allows the removal of an attendee from an event by specifying the event and account IDs.
 * It is designed to be used in applications where managing event attendees is required.
 * @name DeleteEventAttendee
 * @param {string} eventId (path) The id of the event
 * @param {string} accountId (path) The id of the account
 * @version 1.3
 **/
export interface DeleteEventAttendeeParams extends MutationParams {
  eventId: string;
  accountId: string;
}

export const DeleteEventAttendee = async ({
  eventId,
  accountId,
  adminApiParams,
  queryClient,
}: DeleteEventAttendeeParams): Promise<ConnectedXMResponse<EventAttendee>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<EventAttendee>>(
    `/events/${eventId}/attendees/${accountId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEES_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_ATTENDEE_QUERY_KEY(eventId, accountId),
    });
  }
  return data;
};

export const useDeleteEventAttendee = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventAttendee>>,
      Omit<DeleteEventAttendeeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventAttendeeParams,
    Awaited<ReturnType<typeof DeleteEventAttendee>>
  >(DeleteEventAttendee, options, {
    domain: "events",
    type: "update",
  });
};
