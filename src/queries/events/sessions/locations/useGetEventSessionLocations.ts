import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionLocation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../../useGetEvent";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_LOCATIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SESSION_LOCATIONS",
];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
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
/**
 * @category Hooks
 * @group Events
 */
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
