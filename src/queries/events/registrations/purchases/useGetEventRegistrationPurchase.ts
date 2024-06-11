import { ConnectedXMResponse } from "@src/interfaces";
import { Purchase } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { EVENT_REGISTRATION_PURCHASES_QUERY_KEY } from "./useGetEventRegistrationPurchases";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_REGISTRATION_PURCHASE_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => [
  ...EVENT_REGISTRATION_PURCHASES_QUERY_KEY(eventId, registrationId),
  purchaseId,
];

/**
 * @category Setters
 * @group Events
 */
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

interface GetEventRegistrationPurchaseProps extends SingleQueryParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventRegistrationPurchase = async ({
  eventId,
  registrationId,
  purchaseId,
  adminApiParams,
}: GetEventRegistrationPurchaseProps): Promise<
  ConnectedXMResponse<Purchase>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventRegistrationPurchase = (
  eventId: string = "",
  registrationId: string = "",
  purchaseId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventRegistrationPurchase>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventRegistrationPurchase>
  >(
    EVENT_REGISTRATION_PURCHASE_QUERY_KEY(eventId, registrationId, purchaseId),
    (params: SingleQueryParams) =>
      GetEventRegistrationPurchase({
        eventId,
        registrationId,
        purchaseId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!registrationId &&
        !!purchaseId &&
        (options?.enabled ?? true),
    }
  );
};
