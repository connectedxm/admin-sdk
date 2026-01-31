import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventPass } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ATTENDEE_PASSES_QUERY_KEY,
  EVENT_ATTENDEE_QUERY_KEY,
  EVENT_PASSES_QUERY_KEY,
  EVENT_PASS_TYPE_PASSES_QUERY_KEY,
  SET_EVENT_PASS_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attendee-Passes
 */
export interface CheckinEventPassParams extends MutationParams {
  eventId: string;
  passId: string;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const CheckinEventPass = async ({
  eventId,
  passId,
  adminApiParams,
  queryClient,
}: CheckinEventPassParams): Promise<ConnectedXMResponse<EventPass>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<EventPass>>(
    `/events/${eventId}/passes/${passId}/checkin`
  );
  if (queryClient && data.status === "ok") {
    if (data.data.ticketId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_PASS_TYPE_PASSES_QUERY_KEY(eventId, data.data.ticketId),
      });
    }
    if (data.data.attendee) {
      queryClient.invalidateQueries({
        queryKey: EVENT_ATTENDEE_QUERY_KEY(
          eventId,
          data.data.attendee.accountId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: EVENT_ATTENDEE_PASSES_QUERY_KEY(
          eventId,
          data.data.attendee.accountId
        ),
      });
    }
    queryClient.invalidateQueries({
      queryKey: EVENT_PASSES_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_PASSES_QUERY_KEY(eventId, true),
    });
    SET_EVENT_PASS_QUERY_DATA(queryClient, [eventId, passId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useCheckinEventPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CheckinEventPass>>,
      Omit<CheckinEventPassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CheckinEventPassParams,
    Awaited<ReturnType<typeof CheckinEventPass>>
  >(CheckinEventPass, options);
};
