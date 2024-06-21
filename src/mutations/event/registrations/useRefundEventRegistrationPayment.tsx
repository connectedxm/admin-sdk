import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Payment } from "@interfaces";
import { EVENT_REGISTRATION_PAYMENTS_QUERY_KEY } from "@context/queries/events/registrations/payments/useGetEventRegistrationPayments";

interface RefundEventRegistrationPaymentParams {
  eventId: string;
  registrationId: string;
  paymentId: string;
  amount: number;
}

export const RefundEventRegistrationPayment = async ({
  eventId,
  registrationId,
  paymentId,
  amount,
}: RefundEventRegistrationPaymentParams): Promise<
  ConnectedXMResponse<Payment>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/registrations/${registrationId}/payments/${paymentId}/refunds`,
    {
      amount,
    }
  );
  return data;
};

export const useRefundEventRegistrationPayment = (
  eventId: string,
  registrationId: string,
  paymentId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (amount: number) =>
      RefundEventRegistrationPayment({
        eventId,
        registrationId,
        paymentId,
        amount,
      }),
    {
      onSuccess: (r) => {
        queryClient.invalidateQueries(
          EVENT_REGISTRATION_PAYMENTS_QUERY_KEY(eventId, registrationId)
        );
      },
    }
  );
};

export default useRefundEventRegistrationPayment;
