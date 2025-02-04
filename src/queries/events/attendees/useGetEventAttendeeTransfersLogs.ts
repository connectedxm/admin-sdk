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
 * Endpoint to retrieve a list of attendee transfer logs for a specific event and account.
 * This function fetches the transfer logs associated with attendees of a given event and account.
 * It is useful for tracking and managing attendee transfers within an event context.
 * @name GetEventAttendeeTransfersLogs
 * @param {string} eventId - The id of the event
 * @param {string} accountId - The id of the account
 * @version 1.2
 **/

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
    },
    "events"
  );
};