import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionLocation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../../useGetEvent";

/**
 * Retrieves a list of session locations for a specified event.
 * This function is designed to fetch session location data associated with a particular event, 
 * providing necessary details for applications that require event session information.
 * @name GetEventSessionLocations
 * @param {string} eventId (path) - The id of the event
 * @version 1.3
 **/

export const EVENT_SESSION_LOCATIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SESSION_LOCATIONS",
];

export const SET_EVENT_SESSION_LOCATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_LOCATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionLocations>>
) => {
  client.setQueryData(
    EVENT_SESSION_LOCATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionLocationsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventSessionLocations = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionLocationsProps): Promise<
  ConnectedXMResponse<EventSessionLocation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/sessionLocations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetEventSessionLocations = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionLocations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionLocations>>
  >(
    EVENT_SESSION_LOCATIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventSessionLocations({
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