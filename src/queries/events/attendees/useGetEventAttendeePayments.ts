import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Payment } from "@src/interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryOptions,
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ATTENDEE_QUERY_KEY } from "./useGetEventAttendee";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ATTENDEE_PAYMENTS_QUERY_KEY = (
  eventId: string,
  attendeeId: string
) => [...EVENT_ATTENDEE_QUERY_KEY(eventId, attendeeId), "PAYMENTS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ATTENDEE_PAYMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_PAYMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeePayments>>
) => {
  client.setQueryData(
    EVENT_ATTENDEE_PAYMENTS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventAttendeePaymentsProps extends InfiniteQueryParams {
  eventId: string;
  attendeeId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAttendeePayments = async ({
  eventId,
  attendeeId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAttendeePaymentsProps): Promise<ConnectedXMResponse<Payment[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/attendees/${attendeeId}/payments`,
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
export const useGetEventAttendeePayments = (
  eventId: string = "",
  attendeeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttendeePayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttendeePayments>>
  >(
    EVENT_ATTENDEE_PAYMENTS_QUERY_KEY(eventId, attendeeId),
    (params: InfiniteQueryParams) =>
      GetEventAttendeePayments({ ...params, eventId, attendeeId }),
    params,
    {
      ...options,
      enabled: !!eventId && !!attendeeId && (options.enabled ?? true),
    },
    "events"
  );
};
