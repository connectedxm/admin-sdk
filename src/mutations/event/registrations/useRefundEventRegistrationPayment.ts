import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Payment } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_REGISTRATION_PAYMENTS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Event-Registrations
 */
export interface RefundEventRegistrationPaymentParams extends MutationParams {
  eventId: string;
  registrationId: string;
  paymentId: string;
  amount: number;
}

/**
 * @category Methods
 * @group Event-Registrations
 */
export const RefundEventRegistrationPayment = async ({
  eventId,
  registrationId,
  paymentId,
  amount,
  adminApiParams,
  queryClient,
}: RefundEventRegistrationPaymentParams): Promise<
  ConnectedXMResponse<Payment>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Payment>>(
    `/events/${eventId}/registrations/${registrationId}/payments/${paymentId}/refunds`,
    {
      amount,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRATION_PAYMENTS_QUERY_KEY(eventId, registrationId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Registrations
 */
export const useRefundEventRegistrationPayment = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RefundEventRegistrationPayment>>,
      Omit<
        RefundEventRegistrationPaymentParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RefundEventRegistrationPaymentParams,
    Awaited<ReturnType<typeof RefundEventRegistrationPayment>>
  >(RefundEventRegistrationPayment, options);
};
