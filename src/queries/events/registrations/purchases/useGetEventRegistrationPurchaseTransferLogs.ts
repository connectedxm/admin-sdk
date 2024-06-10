import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { PurchaseTransferLog } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_REGISTRATION_PURCHASE_QUERY_KEY } from "./useGetEventRegistrationPurchase";

export const EVENT_REGISTRATION_PURCHASE_TRANSFER_LOGS_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => [
  ...EVENT_REGISTRATION_PURCHASE_QUERY_KEY(eventId, registrationId, purchaseId),
  "TRANSFER_LOGS",
];

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

export const GetEventRegistrationPurchaseTransferLogs = async ({
  eventId,
  registrationId,
  purchaseId,
  pageParam,
  pageSize,
  orderBy,
  search,
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

const useGetEventRegistrationPurchaseTransferLogs = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRegistrationPurchaseTransferLogs>>
  >(
    EVENT_REGISTRATION_PURCHASE_TRANSFER_LOGS_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId
    ),
    (params: any) => GetEventRegistrationPurchaseTransferLogs(params),
    {
      eventId,
      registrationId,
      purchaseId,
    },
    {
      enabled: !!eventId && !!registrationId && !!purchaseId,
    }
  );
};

export default useGetEventRegistrationPurchaseTransferLogs;
