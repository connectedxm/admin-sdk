import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventAttendee } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventAttendeeCreateInputs } from "@src/params";
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
  attendee: EventAttendeeCreateInputs;
}

/**
 * @category Methods
 * @group Event-Attendees
 */
export const CreateEventAttendee = async ({
  eventId,
  attendee,
  adminApiParams,
  queryClient,
}: CreateEventAttendeeParams): Promise<ConnectedXMResponse<EventAttendee>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventAttendee>>(
    `/events/${eventId}/attendees`,
    attendee
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEES_QUERY_KEY(eventId),
    });
    SET_EVENT_ATTENDEE_QUERY_DATA(
      queryClient,
      [eventId, attendee.accountId],
      data
    );
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
  >(CreateEventAttendee, options);
};
