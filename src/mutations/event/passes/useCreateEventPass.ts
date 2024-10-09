import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventPassCreateInputs } from "@src/params";
import {
  EVENT_ATTENDEE_PASSES_QUERY_KEY,
  EVENT_ATTENDEE_QUERY_KEY,
  SET_EVENT_PASS_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attendees-Passs
 */
export interface CreateEventPassParams extends MutationParams {
  eventId: string;
  attendeeId: string;
  pass: EventPassCreateInputs;
}

/**
 * @category Methods
 * @group Event-Attendees-Passs
 */
export const CreateEventPass = async ({
  eventId,
  attendeeId,
  pass,
  adminApiParams,
  queryClient,
}: CreateEventPassParams): Promise<ConnectedXMResponse<EventPass>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventPass>>(
    `/events/${eventId}/attendees/${attendeeId}/passes`,
    pass
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASSES_QUERY_KEY(eventId, attendeeId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_QUERY_KEY(eventId, attendeeId),
    });
    SET_EVENT_PASS_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendees-Passs
 */
export const useCreateEventPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventPass>>,
      Omit<CreateEventPassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventPassParams,
    Awaited<ReturnType<typeof CreateEventPass>>
  >(CreateEventPass, options, {
    domain: "events",
    type: "update",
  });
};
