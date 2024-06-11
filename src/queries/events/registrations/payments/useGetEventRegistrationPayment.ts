import { ConnectedXMResponse } from "@src/interfaces";
import { Payment } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { EVENT_REGISTRATION_PAYMENTS_QUERY_KEY } from "./useGetEventRegistrationPayments";
import { GetAdminAPI } from "@src/AdminAPI";

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

interface GetEventRegistrationPaymentProps extends SingleQueryParams {
  eventId: string;
  registrationId: string;
  paymentId: string;
}

export const GetEventRegistrationPayment = async ({
  eventId,
  registrationId,
  paymentId,
  adminApiParams,
}: GetEventRegistrationPaymentProps): Promise<ConnectedXMResponse<Payment>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/${registrationId}/payments/${paymentId}`
  );
  return data;
};
export const useGetEventRegistrationPayment = (
  eventId: string = "",
  registrationId: string = "",
  paymentId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventRegistrationPayment>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventRegistrationPayment>
  >(
    EVENT_REGISTRATION_PAYMENT_QUERY_KEY(eventId, registrationId, paymentId),
    (params: SingleQueryParams) =>
      GetEventRegistrationPayment({
        eventId,
        registrationId,
        paymentId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!registrationId && !!paymentId,
    }
  );
};
