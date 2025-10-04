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
 * @category Params
 * @group Event-Attendees
 */
export interface UpdateEventAttendeeParams extends MutationParams {
  eventId: string;
  accountId: string;
  registration: EventAttendeeUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Attendees
 */
export const UpdateEventAttendee = async ({
  eventId,
  accountId,
  registration,
  adminApiParams,
  queryClient,
}: UpdateEventAttendeeParams): Promise<ConnectedXMResponse<EventAttendee>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
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

/**
 * @category Mutations
 * @group Event-Attendees
 */
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
  >(UpdateEventAttendee, options);
};
