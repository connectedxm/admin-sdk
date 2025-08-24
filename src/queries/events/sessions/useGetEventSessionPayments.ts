import { ConnectedXMResponse } from "@src/interfaces";
import { Payment } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SESSION_QUERY_KEY } from "./useGetEventSession";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_PAYMENTS_QUERY_KEY = (
  eventId: string,
  sessionId: string
) => [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "PAYMENTS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_PAYMENTS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_PAYMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionPayments>>
) => {
  client.setQueryData(EVENT_SESSION_PAYMENTS_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionPaymentsProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionPayments = async ({
  eventId,
  sessionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionPaymentsProps): Promise<ConnectedXMResponse<Payment[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/payments`,
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
export const useGetEventSessionPayments = (
  eventId: string = "",
  sessionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionPayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionPayments>>
  >(
    EVENT_SESSION_PAYMENTS_QUERY_KEY(eventId, sessionId),
    (params: InfiniteQueryParams) =>
      GetEventSessionPayments({
        ...params,
        eventId,
        sessionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sessionId && (options.enabled ?? true),
    },
    "events"
  );
};
