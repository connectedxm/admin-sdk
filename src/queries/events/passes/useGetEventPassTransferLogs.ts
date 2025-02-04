import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { TransferLog } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_PASS_QUERY_KEY } from "./useGetEventPass";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";

/**
 * Retrieves the transfer logs for a specific event pass, supporting pagination and filtering.
 * This function is designed to fetch detailed logs of transfers associated with a particular event pass.
 * It supports pagination and filtering to allow for efficient data retrieval and management.
 * @name GetEventPassTransferLogs
 * @param {string} eventId - The id of the event
 * @param {string} passId - The id of the pass
 * @version 1.2
 **/

export const EVENT_PASS_TRANSFER_LOGS_QUERY_KEY = (
  eventId: string,
  passId: string
) => [...EVENT_PASS_QUERY_KEY(eventId, passId), "TRANSFER_LOGS"];

export const SET_EVENT_PASS_TRANSFER_LOGS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_TRANSFER_LOGS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassTransferLogs>>
) => {
  client.setQueryData(
    EVENT_PASS_TRANSFER_LOGS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassTransferLogsProps extends InfiniteQueryParams {
  eventId: string;
  passId: string;
}

export const GetEventPassTransferLogs = async ({
  eventId,
  passId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPassTransferLogsProps): Promise<
  ConnectedXMResponse<TransferLog[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passes/${passId}/transfers/logs`,
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

export const useGetEventPassTransferLogs = (
  eventId: string = "",
  passId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassTransferLogs>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassTransferLogs>>
  >(
    EVENT_PASS_TRANSFER_LOGS_QUERY_KEY(eventId, passId),
    (params: InfiniteQueryParams) =>
      GetEventPassTransferLogs({
        ...params,
        eventId,
        passId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passId && (options.enabled ?? true),
    },
    "events"
  );
};