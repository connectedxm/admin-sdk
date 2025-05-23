import { ConnectedXMResponse } from "@src/interfaces";
import { EventSponsorshipLevel } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SPONSORSHIP_LEVELS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SPONSORSHIP_LEVELS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SPONSORSHIP_LEVELS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SPONSORSHIP_LEVELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSponsorshipLevels>>
) => {
  client.setQueryData(
    EVENT_SPONSORSHIP_LEVELS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSponsorshipLevelsProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSponsorshipLevels = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSponsorshipLevelsProps): Promise<
  ConnectedXMResponse<EventSponsorshipLevel[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/sponsorshipLevels`, {
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
export const useGetEventSponsorshipLevels = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSponsorshipLevels>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSponsorshipLevels>>
  >(
    EVENT_SPONSORSHIP_LEVELS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventSponsorshipLevels({
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
