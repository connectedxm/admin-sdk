import { GetAdminAPI } from '@src/AdminAPI';
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { EVENT_REGISTRATION_QUERY_KEY } from "./useGetEventRegistration";

export const EVENT_REGISTRATION_PAYMENT_URL_QUERY_KEY = (
  eventId: string,
  registrationId: string
) => [...EVENT_REGISTRATION_QUERY_KEY(eventId, registrationId), "PAYMENT_URL"];

export const SET_EVENT_REGISTRATION_PAYMENT_URL_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_REGISTRATION_PAYMENT_URL_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationPaymentUrl>>
) => {
  client.setQueryData(
    EVENT_REGISTRATION_PAYMENT_URL_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRegistrationPaymentUrlProps {
  eventId: string;
  registrationId: string;
}

export const GetEventRegistrationPaymentUrl = async ({
  eventId,
  registrationId,
}: GetEventRegistrationPaymentUrlProps): Promise<
  ConnectedXMResponse<string>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/${registrationId}/pendingPayment`
  );
  return data;
};

const useGetEventRegistrationPaymentUrl = (
  eventId: string,
  registrationId: string = ""
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventRegistrationPaymentUrl>>((
    EVENT_REGISTRATION_PAYMENT_URL_QUERY_KEY(eventId, registrationId),
    () => GetEventRegistrationPaymentUrl({ eventId, registrationId }),
    {
      enabled: !!eventId && !!registrationId,
      staleTime: 0,
    }
  );
};

export default useGetEventRegistrationPaymentUrl;
