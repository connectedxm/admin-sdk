import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { PurchaseTransferLog } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_REGISTRATION_PURCHASE_QUERY_KEY } from "./useGetEventRegistrationPurchase";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_REGISTRATION_PURCHASE_TRANSFER_LOGS_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => [
  ...EVENT_REGISTRATION_PURCHASE_QUERY_KEY(eventId, registrationId, purchaseId),
  "TRANSFER_LOGS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_REGISTRATION_PURCHASE_TRANSFER_LOGS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof EVENT_REGISTRATION_PURCHASE_TRANSFER_LOGS_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetEventRegistrationPurchaseTransferLogs>>
) => {
  client.setQueryData(
    EVENT_REGISTRATION_PURCHASE_TRANSFER_LOGS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRegistrationPurchaseTransferLogsProps
  extends InfiniteQueryParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventRegistrationPurchaseTransferLogs = async ({
  eventId,
  registrationId,
  purchaseId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventRegistrationPurchaseTransferLogsProps): Promise<
  ConnectedXMResponse<PurchaseTransferLog[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/transfers/logs`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventRegistrationPurchaseTransferLogs = (
  eventId: string = "",
  registrationId: string = "",
  purchaseId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventRegistrationPurchaseTransferLogs>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRegistrationPurchaseTransferLogs>>
  >(
    EVENT_REGISTRATION_PURCHASE_TRANSFER_LOGS_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId
    ),
    (params: InfiniteQueryParams) =>
      GetEventRegistrationPurchaseTransferLogs({
        ...params,
        eventId,
        registrationId,
        purchaseId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId &&
        !!registrationId &&
        !!purchaseId &&
        (options.enabled ?? true),
    }
  );
};
