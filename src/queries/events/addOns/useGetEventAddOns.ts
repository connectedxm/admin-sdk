import { ConnectedXMResponse } from "@src/interfaces";
import { EventAddOn } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches a list of event add-ons associated with a specific event.
 * This function supports optional pagination and filtering to retrieve event add-ons efficiently.
 * It is designed for applications that need to display or manage additional features or services linked to an event.
 * @name GetEventAddOns
 * @param {string} eventId (path) - The id of the event
 * @version 1.3
 **/

export const EVENT_ADD_ONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "ADD_ONS",
];

export const SET_EVENT_ADD_ONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ADD_ONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAddOns>>
) => {
  client.setQueryData(EVENT_ADD_ONS_QUERY_KEY(...keyParams), response);
};

interface GetEventAddOnsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventAddOns = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventAddOnsProps): Promise<ConnectedXMResponse<EventAddOn[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/addOns`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetEventAddOns = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetEventAddOns>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEventAddOns>>>(
    EVENT_ADD_ONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventAddOns({
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