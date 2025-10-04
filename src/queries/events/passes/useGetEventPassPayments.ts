import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Payment } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_PASS_QUERY_KEY } from "./useGetEventPass";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_PAYMENTS_QUERY_KEY = (
  eventId: string,
  passId: string
) => [...EVENT_PASS_QUERY_KEY(eventId, passId), "PAYMENTS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_PAYMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_PAYMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassPayments>>
) => {
  client.setQueryData(EVENT_PASS_PAYMENTS_QUERY_KEY(...keyParams), response);
};

interface GetEventPassPaymentsProps extends InfiniteQueryParams {
  eventId: string;
  passId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassPayments = async ({
  eventId,
  passId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPassPaymentsProps): Promise<ConnectedXMResponse<Payment[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passes/${passId}/payments`,
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
export const useGetEventPassPayments = (
  eventId: string = "",
  passId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassPayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassPayments>>
  >(
    EVENT_PASS_PAYMENTS_QUERY_KEY(eventId, passId),
    (params: InfiniteQueryParams) =>
      GetEventPassPayments({
        ...params,
        eventId,
        passId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!passId && (options.enabled ?? true),
    }
  );
};
