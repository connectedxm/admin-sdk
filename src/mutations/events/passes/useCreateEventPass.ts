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
 * Endpoint to create a new event pass for a specified attendee.
 * This function allows the creation of an event pass for a given attendee by specifying the event and account IDs.
 * It is used in scenarios where event organizers need to issue passes to attendees.
 * @name CreateEventPass
 * @param {string} eventId (path) The id of the event
 * @param {string} accountId (path) The id of the account
 * @param {EventPassCreateInputs} pass (body) The inputs for creating the event pass
 * @version 1.3
 **/
export interface CreateEventPassParams extends MutationParams {
  eventId: string;
  accountId: string;
  pass: EventPassCreateInputs;
}

export const CreateEventPass = async ({
  eventId,
  accountId,
  pass,
  adminApiParams,
  queryClient,
}: CreateEventPassParams): Promise<ConnectedXMResponse<EventPass>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<EventPass>>(
    `/events/${eventId}/attendees/${accountId}/passes`,
    pass
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASSES_QUERY_KEY(eventId, accountId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_QUERY_KEY(eventId, accountId),
    });
    SET_EVENT_PASS_QUERY_DATA(queryClient, [eventId, data.data.id], data);
  }
  return data;
};

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
