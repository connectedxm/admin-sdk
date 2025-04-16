import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Payment } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SESSION_PASS_QUERY_KEY } from "./useGetEventSessionPass";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_PASS_PAYMENTS_QUERY_KEY = (
  eventId: string,
  sessionPassId: string
) => [...EVENT_SESSION_PASS_QUERY_KEY(eventId, sessionPassId), "PAYMENTS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_PASS_PAYMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_PASS_PAYMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionPassPayments>>
) => {
  client.setQueryData(
    EVENT_SESSION_PASS_PAYMENTS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionPassPaymentsProps extends InfiniteQueryParams {
  eventId: string;
  sessionPassId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionPassPayments = async ({
  eventId,
  sessionPassId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionPassPaymentsProps): Promise<
  ConnectedXMResponse<Payment[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessionPasses/${sessionPassId}/payments`,
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
export const useGetEventSessionPassPayments = (
  eventId: string = "",
  sessionPassId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionPassPayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionPassPayments>>
  >(
    EVENT_SESSION_PASS_PAYMENTS_QUERY_KEY(eventId, sessionPassId),
    (params: InfiniteQueryParams) =>
      GetEventSessionPassPayments({
        ...params,
        eventId,
        sessionPassId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sessionPassId && (options.enabled ?? true),
    },
    "events"
  );
};
