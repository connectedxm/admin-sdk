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
 * @category Params
 * @group Event-Attendees
 */
export interface CreateEventAttendeeParams extends MutationParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Event-Attendees
 */
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

/**
 * @category Mutations
 * @group Event-Attendees
 */
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
