import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Payment } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

import { EVENT_QUERY_KEY } from "./useGetEvent";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PAYMENTS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "PAYMENTS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PAYMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PAYMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPayments>>
) => {
  client.setQueryData(EVENT_PAYMENTS_QUERY_KEY(...keyParams), response);
};

interface GetEventPaymentsProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPayments = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPaymentsProps): Promise<ConnectedXMResponse<Payment[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/payments`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPayments = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPayments>>
  >(
    EVENT_PAYMENTS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventPayments({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    },
    "events"
  );
};
