import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_PURCHASES_QUERY_KEY } from "./useGetEventPurchases";
import {
  SingleQueryParams,
  SingleQueryOptions,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse, Purchase } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Purchases
 */
export const EVENT_PURCHASE_QUERY_KEY = (
  eventId: string,
  purchaseId: string
) => [...EVENT_PURCHASES_QUERY_KEY(eventId), purchaseId];

interface GetEventPurchaseProps extends SingleQueryParams {
  eventId: string;
  purchaseId: string;
}

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PURCHASE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PURCHASE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPurchase>>
) => {
  client.setQueryData(EVENT_PURCHASE_QUERY_KEY(...keyParams), response);
};

/**
 * @category Queries
 * @group Purchases
 */
export const GetEventPurchase = async ({
  eventId,
  purchaseId,
  adminApiParams,
}: GetEventPurchaseProps): Promise<ConnectedXMResponse<Purchase>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<Purchase>>(
    `/events/${eventId}/purchases/${purchaseId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Purchases
 */
export const useGetEventPurchase = (
  eventId: string = "",
  purchaseId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventPurchase>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPurchase>>(
    EVENT_PURCHASE_QUERY_KEY(eventId, purchaseId),
    (params: SingleQueryParams) =>
      GetEventPurchase({
        eventId,
        purchaseId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!purchaseId && (options.enabled ?? true),
    }
  );
};
