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
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_LOCATION_SESSIONS_QUERY_KEY = (
  eventId: string,
  locationId: string
) => [...EVENT_SESSION_LOCATION_QUERY_KEY(eventId, locationId), "SESSIONS"];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
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
/**
 * @category Hooks
 * @group Events
 */
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
    }
  );
};
