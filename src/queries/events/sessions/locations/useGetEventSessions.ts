import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSession } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_LOCATION_QUERY_KEY } from "./useGetEventSessionLocation";

/**
 * Endpoint to fetch sessions for a specific event location.
 * This function retrieves a list of sessions associated with a particular event location,
 * allowing users to access detailed session information for event management purposes.
 * @name GetEventSessionLocationSessions
 * @param {string} eventId (path) The id of the event
 * @param {string} locationId (path) The id of the location
 * @version 1.3
 **/

export const EVENT_SESSION_LOCATION_SESSIONS_QUERY_KEY = (
  eventId: string,
  locationId: string
) => [...EVENT_SESSION_LOCATION_QUERY_KEY(eventId, locationId), "SESSIONS"];

export const SET_EVENT_SESSION_LOCATION_SESSIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_LOCATION_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionLocationSessions>>
) => {
  client.setQueryData(
    EVENT_SESSION_LOCATION_SESSIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionLocationSessionsProps extends InfiniteQueryParams {
  eventId: string;
  locationId: string;
}

export const GetEventSessionLocationSessions = async ({
  eventId,
  locationId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionLocationSessionsProps): Promise<
  ConnectedXMResponse<EventSession[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessionLocations/${locationId}/sessions`,
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

export const useGetEventSessionLocationSessions = (
  eventId: string = "",
  locationId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionLocationSessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionLocationSessions>>
  >(
    EVENT_SESSION_LOCATION_SESSIONS_QUERY_KEY(eventId, locationId),
    (params: InfiniteQueryParams) =>
      GetEventSessionLocationSessions({
        ...params,
        eventId,
        locationId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!locationId && (options.enabled ?? true),
    },
    "events"
  );
};
