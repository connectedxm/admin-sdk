import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ATTENDEE_PASSES_QUERY_KEY,
  EVENT_PASSES_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to check in all passes for a specific attendee at an event.
 * This function allows for the bulk check-in of all passes associated with a particular attendee at a given event.
 * It is useful in scenarios where an attendee needs to be quickly checked in for all their passes.
 * @name CheckinAllAttendeePasses
 * @param {string} eventId (path) - The id of the event
 * @param {string} accountId (path) - The id of the account
 * @version 1.3
 **/
export interface CheckinAllAttendeePassesParams extends MutationParams {
  eventId: string;
  accountId: string;
}

export const CheckinAllAttendeePasses = async ({
  eventId,
  accountId,
  adminApiParams,
  queryClient,
}: CheckinAllAttendeePassesParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<null>>(
    `/events/${eventId}/attendees/${accountId}/passes/checkin/all`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASSES_QUERY_KEY(eventId, accountId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_PASSES_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useCheckinAllAttendeePasses = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CheckinAllAttendeePasses>>,
      Omit<CheckinAllAttendeePassesParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CheckinAllAttendeePassesParams,
    Awaited<ReturnType<typeof CheckinAllAttendeePasses>>
  >(CheckinAllAttendeePasses, options, {
    domain: "events",
    type: "update",
  });
};