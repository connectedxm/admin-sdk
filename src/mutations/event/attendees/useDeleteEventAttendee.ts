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
 * @category Params
 * @group Event-Attendees
 */
export interface DeleteEventAttendeeParams extends MutationParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Event-Attendees
 */
export const DeleteEventAttendee = async ({
  eventId,
  accountId,
  adminApiParams,
  queryClient,
}: DeleteEventAttendeeParams): Promise<ConnectedXMResponse<EventAttendee>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<EventAttendee>>(
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

/**
 * @category Mutations
 * @group Event-Attendees
 */
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
  >(DeleteEventAttendee, options);
};
