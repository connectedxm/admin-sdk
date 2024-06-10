import { ConnectedXMResponse } from "@src/interfaces";
import { Purchase } from "@src/interfaces";
import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { EVENT_REGISTRATION_PURCHASES_QUERY_KEY } from "./useGetEventRegistrationPurchases";

export const EVENT_REGISTRATION_PURCHASE_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => [
  ...EVENT_REGISTRATION_PURCHASES_QUERY_KEY(eventId, registrationId),
  purchaseId,
];

export const SET_EVENT_REGISTRATION_PURCHASE_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_REGISTRATION_PURCHASE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationPurchase>>
) => {
  client.setQueryData(
    EVENT_REGISTRATION_PURCHASE_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRegistrationPurchaseProps {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const GetEventRegistrationPurchase = async ({
  eventId,
  registrationId,
  purchaseId,
}: GetEventRegistrationPurchaseProps): Promise<
  ConnectedXMResponse<Purchase>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}`
  );
  return data;
};

const useGetEventRegistrationPurchase = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventRegistrationPurchase>>((
    EVENT_REGISTRATION_PURCHASE_QUERY_KEY(eventId, registrationId, purchaseId),
    () => GetEventRegistrationPurchase({ eventId, registrationId, purchaseId }),
    {
      enabled: !!eventId && !!registrationId && !!purchaseId,
    }
  );
};

export default useGetEventRegistrationPurchase;
