import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Payment } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ATTENDEE_PAYMENTS_QUERY_KEY,
  PAYMENT_QUERY_KEY,
  PAYMENTS_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to process a refund for a specific payment within an organization.
 * This function allows for the refunding of a specified payment amount, optionally associated with an event.
 * It is designed to be used in scenarios where a payment needs to be refunded, and updates relevant queries upon success.
 * @name RefundOrganizationPayment
 * @param {string} paymentId (path) The id of the payment to be refunded
 * @param {number} amount (bodyValue) The amount to be refunded
 * @version 1.3
 **/

export interface RefundOrganizationPaymentParams extends MutationParams {
  paymentId: string;
  eventId?: string;
  amount: number;
}

export const RefundOrganizationPayment = async ({
  paymentId,
  eventId,
  amount,
  adminApiParams,
  queryClient,
}: RefundOrganizationPaymentParams): Promise<ConnectedXMResponse<Payment>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Payment>>(
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
  }

  return data;
};

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
