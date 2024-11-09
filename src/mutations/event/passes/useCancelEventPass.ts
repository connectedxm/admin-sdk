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
export interface CancelEventPassParams extends MutationParams {
  eventId: string;
  passId: string;
  email?: boolean;
}

/**
 * @category Methods
 * @group Event-Attendee-Passes
 */
export const CancelEventPass = async ({
  eventId,
  passId,
  email,
  adminApiParams,
  queryClient,
}: CancelEventPassParams): Promise<ConnectedXMResponse<EventPass>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventPass>>(
    `/events/${eventId}/passes/${passId}/cancel`,
    { email }
  );
  if (queryClient && data.status === "ok") {
    if (data.data.ticketId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_PASS_TYPE_PASSES_QUERY_KEY(eventId, data.data.ticketId),
      });
    }
    if (data.data.registrationId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_ATTENDEE_QUERY_KEY(eventId, data.data.registrationId),
      });
      queryClient.invalidateQueries({
        queryKey: EVENT_ATTENDEE_PASSES_QUERY_KEY(
          eventId,
          data.data.registrationId
        ),
      });
    }
    queryClient.invalidateQueries({
      queryKey: EVENT_PASSES_QUERY_KEY(eventId),
    });
    SET_EVENT_PASS_QUERY_DATA(queryClient, [eventId, passId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Attendee-Passes
 */
export const useCancelEventPass = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CancelEventPass>>,
      Omit<CancelEventPassParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelEventPassParams,
    Awaited<ReturnType<typeof CancelEventPass>>
  >(CancelEventPass, options, {
    domain: "events",
    type: "update",
  });
};
