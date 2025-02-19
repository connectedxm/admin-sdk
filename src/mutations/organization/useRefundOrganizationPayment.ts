import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Payment } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  BOOKING_PAYMENTS_QUERY_KEY,
  EVENT_ATTENDEE_PAYMENTS_QUERY_KEY,
  PAYMENT_QUERY_KEY,
  PAYMENTS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Attendees
 */
export interface RefundOrganizationPaymentParams extends MutationParams {
  paymentId: string;
  eventId?: string;
  amount: number;
}

/**
 * @category Methods
 * @group Event-Attendees
 */
export const RefundOrganizationPayment = async ({
  paymentId,
  eventId,
  amount,
  adminApiParams,
  queryClient,
}: RefundOrganizationPaymentParams): Promise<ConnectedXMResponse<Payment>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Payment>>(
    `/payments/${paymentId}/refund`,
    {
      amount,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: PAYMENT_QUERY_KEY(paymentId),
    });

    queryClient.invalidateQueries({
      queryKey: PAYMENTS_QUERY_KEY(),
    });

    if (eventId && data.data?.registrationId) {
      queryClient.invalidateQueries({
        queryKey: EVENT_ATTENDEE_PAYMENTS_QUERY_KEY(
          eventId,
          data.data.registrationId
        ),
      });
    }

    if (data.data?.bookingId) {
      queryClient.invalidateQueries({
        queryKey: BOOKING_PAYMENTS_QUERY_KEY(data.data.bookingId),
      });
    }
  }

  return data;
};

/**
 * @category Mutations
 * @group Event-Attendees
 */
export const useRefundOrganizationPayment = (
  eventId?: string,
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RefundOrganizationPayment>>,
      Omit<RefundOrganizationPaymentParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RefundOrganizationPaymentParams,
    Awaited<ReturnType<typeof RefundOrganizationPayment>>
  >((params) => RefundOrganizationPayment({ ...params, eventId }), options, {
    domain: "events",
    type: "update",
  });
};
