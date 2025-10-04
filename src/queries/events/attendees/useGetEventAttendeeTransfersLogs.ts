import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { TransferLog } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ATTENDEE_TRANSFER_LOGS_QUERY_KEY = (
  eventId: string,
  accountId: string
) => {
  const keys = [
    ...EVENT_QUERY_KEY(eventId),
    "ATTENDEE_TRANSFER_LOGS",
    accountId,
  ];
  return keys;
};

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ATTENDEE_TRANSFER_LOGS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_TRANSFER_LOGS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeeTransfersLogs>>
) => {
  client.setQueryData(
    EVENT_ATTENDEE_TRANSFER_LOGS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventAttendeeTransfersLogsProps extends InfiniteQueryParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAttendeeTransfersLogs = async ({
  eventId,
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAttendeeTransfersLogsProps): Promise<
  ConnectedXMResponse<TransferLog[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/attendees/${accountId}/transfers/logs`,
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
export const useGetEventAttendeeTransfersLogs = (
  eventId: string,
  accountId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttendeeTransfersLogs>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttendeeTransfersLogs>>
  >(
    EVENT_ATTENDEE_TRANSFER_LOGS_QUERY_KEY(eventId, accountId),
    (params: InfiniteQueryParams) =>
      GetEventAttendeeTransfersLogs({
        ...params,
        eventId,
        accountId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!accountId && (options.enabled ?? true),
    }
  );
};
