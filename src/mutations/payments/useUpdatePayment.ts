import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, Payment } from "@src/interfaces";
import { SET_PAYMENT_QUERY_DATA, PAYMENT_QUERY_KEY } from "@src/queries";
import { PaymentUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Stream
 */
export interface UpdatePaymentParams extends MutationParams {
  paymentId: string;
  payment: PaymentUpdateInputs;
}

/**
 * @category Methods
 * @group Stream
 */
export const UpdatePayment = async ({
  paymentId,
  payment,
  adminApiParams,
  queryClient,
}: UpdatePaymentParams): Promise<ConnectedXMResponse<Payment>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<Payment>>(
    `/payments/${paymentId}`,
    payment
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEY(paymentId) });

    if (typeof payment.registrationId !== "undefined") {
      // Invalidate all event attendee payments queries since we don't have eventId/accountId
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          // Check if this matches the EVENT_ATTENDEE_PAYMENTS_QUERY_KEY structure:
          // ["EVENTS", eventId, "ATTENDEES", accountId, "PAYMENTS", ""]
          return (
            Array.isArray(queryKey) &&
            queryKey.length === 6 &&
            queryKey[0] === "EVENTS" &&
            queryKey[2] === "ATTENDEES" &&
            queryKey[4] === "PAYMENTS"
          );
        },
      });
    }

    SET_PAYMENT_QUERY_DATA(queryClient, [paymentId], data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Stream
 */
export const useUpdatePayment = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdatePayment>>,
      Omit<UpdatePaymentParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdatePaymentParams,
    Awaited<ReturnType<typeof UpdatePayment>>
  >(UpdatePayment, options);
};
