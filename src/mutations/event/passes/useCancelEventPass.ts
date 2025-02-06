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
 * Endpoint to cancel an event pass.
 * This function allows the cancellation of a specific event pass by its ID, with options to send a notification email, issue a refund, specify an admin refund amount, and remove a reservation.
 * It is designed for use in event management systems where administrators need to manage event passes efficiently.
 * @name CancelEventPass
 * @param {string} eventId (path) - The id of the event
 * @param {string} passId (path) - The id of the pass
 * @param {boolean} [sendEmail] (bodyValue) - Optionally send an email
 * @param {boolean} [issueRefund] (bodyValue) - Optionally issue a refund
 * @param {number} [adminRefundAmt] (bodyValue) - Optional admin refund amount
 * @param {boolean} [removeReservation] (bodyValue) - Optionally remove a reservation
 * @version 1.3
 **/
export interface CancelEventPassParams extends MutationParams {
  eventId: string;
  passId: string;
  sendEmail?: boolean;
  issueRefund?: boolean;
  adminRefundAmt?: number;
  removeReservation?: boolean;
}

export const CancelEventPass = async ({
  eventId,
  passId,
  sendEmail,
  issueRefund,
  adminRefundAmt,
  removeReservation,
  adminApiParams,
  queryClient,
}: CancelEventPassParams): Promise<ConnectedXMResponse<EventPass>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<EventPass>>(
    `/events/${eventId}/passes/${passId}/cancel`,
    { sendEmail, issueRefund, adminRefundAmt, removeReservation }
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
    SET_EVENT_PASS_QUERY_DATA(queryClient, [eventId, passId], data);
  }
  return data;
};

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