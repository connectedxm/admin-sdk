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
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_TRANSFER_LOGS_QUERY_KEY = (
  eventId: string,
  passId: string
) => [...EVENT_PASS_QUERY_KEY(eventId, passId), "TRANSFER_LOGS"];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
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
/**
 * @category Hooks
 * @group Events
 */
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
