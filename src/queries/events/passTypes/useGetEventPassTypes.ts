import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPassType } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

/**
 * Endpoint to retrieve and manage event pass types for a specific event.
 * This function allows users to fetch a list of pass types associated with a given event ID.
 * It is designed to be used in applications where event pass type information is required.
 * @name GetEventPassTypes
 * @param {string} eventId - The id of the event
 * @version 1.2
 **/

export const EVENT_PASS_TYPES_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "PASS_TYPES",
];

export const SET_EVENT_PASS_TYPES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_TYPES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassTypes>>
) => {
  client.setQueryData(EVENT_PASS_TYPES_QUERY_KEY(...keyParams), response);
};

interface GetEventPassTypesProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventPassTypes = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventPassTypesProps): Promise<ConnectedXMResponse<EventPassType[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/passTypes`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetEventPassTypes = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassTypes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassTypes>>
  >(
    EVENT_PASS_TYPES_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventPassTypes({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    },
    "events"
  );
};