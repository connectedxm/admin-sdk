import { ConnectedXMResponse } from "@src/interfaces";
import { EventSponsorship } from "@src/interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SPONSORSHIP_LEVEL_QUERY_KEY } from "../sponsorshipLevels/useGetEventSponsorshipLevel";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SPONSORSHIPS_QUERY_KEY = (
  eventId: string,
  levelId: string
) => [...EVENT_SPONSORSHIP_LEVEL_QUERY_KEY(eventId, levelId), "SPONSORSHIPS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SPONSORSHIPS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SPONSORSHIPS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSponsorships>>
) => {
  client.setQueryData(
    [
      ...EVENT_SPONSORSHIPS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(""),
    ],
    { pages: [response], pageParams: [null] }
  );
};

interface GetEventSponsorshipsProps extends InfiniteQueryParams {
  eventId: string;
  levelId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSponsorships = async ({
  eventId,
  levelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSponsorshipsProps): Promise<
  ConnectedXMResponse<EventSponsorship[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sponsorshipLevels/${levelId}/sponsorships`,
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
export const useGetEventSponsorships = (
  eventId: string = "",
  levelId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSponsorships>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSponsorships>>
  >(
    EVENT_SPONSORSHIPS_QUERY_KEY(eventId, levelId),
    (params: InfiniteQueryParams) =>
      GetEventSponsorships({
        ...params,
        eventId,
        levelId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!levelId && (options.enabled ?? true),
    },
    "events"
  );
};
