import { ConnectedXMResponse } from "@src/interfaces";
import { Payment } from "@src/interfaces";
import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { EVENT_REGISTRATION_PAYMENTS_QUERY_KEY } from "./useGetEventRegistrationPayments";

export const EVENT_REGISTRATION_PAYMENT_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  paymentId: string
) => [
  ...EVENT_REGISTRATION_PAYMENTS_QUERY_KEY(eventId, registrationId),
  paymentId,
];

export const SET_EVENT_REGISTRATION_PAYMENT_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_REGISTRATION_PAYMENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationPayment>>
) => {
  client.setQueryData(
    EVENT_REGISTRATION_PAYMENT_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRegistrationPaymentProps {
  eventId: string;
  registrationId: string;
  paymentId: string;
}

export const GetEventRegistrationPayment = async ({
  eventId,
  registrationId,
  paymentId,
}: GetEventRegistrationPaymentProps): Promise<ConnectedXMResponse<Payment>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/${registrationId}/payments/${paymentId}`
  );
  return data;
};

const useGetEventRegistrationPayment = (
  eventId: string,
  registrationId: string,
  paymentId: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventRegistrationPayment>>((
    EVENT_REGISTRATION_PAYMENT_QUERY_KEY(eventId, registrationId, paymentId),
    () => GetEventRegistrationPayment({ eventId, registrationId, paymentId }),
    {
      enabled: !!eventId && !!registrationId && !!paymentId,
    }
  );
};

export default useGetEventRegistrationPayment;
