import { ConnectedXMResponse, EventPassStatus } from "@src/interfaces";
import { EventPass } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ATTENDEE_QUERY_KEY } from "./useGetEventAttendee";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to manage and retrieve event attendee passes for a specific event and account.
 * This function allows users to fetch and manage the passes associated with an event attendee, 
 * providing options to filter by status. It is designed for applications that require detailed 
 * management of event passes for attendees.
 * @name GetEventAttendeePasses
 * @param {string} eventId - The id of the event
 * @param {string} accountId - The id of the account
 * @param {keyof typeof EventPassStatus} [status] - Optional status of the event pass
 * @version 1.2
 **/

export const EVENT_ATTENDEE_PASSES_QUERY_KEY = (
  eventId: string,
  accountId: string,
  status?: keyof typeof EventPassStatus
) => {
  const key = [...EVENT_ATTENDEE_QUERY_KEY(eventId, accountId), "PASSES"];

  if (status) {
    key.push(status);
  }

  return key;
};

export const SET_EVENT_ATTENDEE_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeePasses>>
) => {
  client.setQueryData(EVENT_ATTENDEE_PASSES_QUERY_KEY(...keyParams), response);
};

interface GetEventAttendeePassesProps extends InfiniteQueryParams {
  eventId: string;
  accountId: string;
  status?: keyof typeof EventPassStatus;
}

export const GetEventAttendeePasses = async ({
  eventId,
  accountId,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAttendeePassesProps): Promise<ConnectedXMResponse<EventPass[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/attendees/${accountId}/passes`,
    {
      params: {
        status: status || undefined,
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

export const useGetEventAttendeePasses = (
  eventId: string = "",
  accountId: string = "",
  status?: keyof typeof EventPassStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttendeePasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttendeePasses>>
  >(
    EVENT_ATTENDEE_PASSES_QUERY_KEY(eventId, accountId, status),
    (params: InfiniteQueryParams) =>
      GetEventAttendeePasses({
        ...params,
        eventId,
        accountId,
        status,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!accountId && (options.enabled ?? true),
    },
    "events"
  );
};