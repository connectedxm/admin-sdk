import { ConnectedXMResponse } from "@src/interfaces";
import { EventSponsorshipLevelTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_SPONSORSHIP_LEVEL_QUERY_KEY } from "../useGetEventSponsorshipLevel";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SPONSORSHIP_LEVEL_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  levelId: string
) => [...EVENT_SPONSORSHIP_LEVEL_QUERY_KEY(eventId, levelId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SPONSORSHIP_LEVEL_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SPONSORSHIP_LEVEL_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSponsorshipLevelTranslations>>
) => {
  client.setQueryData(
    EVENT_SPONSORSHIP_LEVEL_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSponsorshipLevelTranslationsProps
  extends InfiniteQueryParams {
  eventId: string;
  levelId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSponsorshipLevelTranslations = async ({
  eventId,
  levelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSponsorshipLevelTranslationsProps): Promise<
  ConnectedXMResponse<EventSponsorshipLevelTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sponsorshipLevels/${levelId}/translations`,
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
export const useGetEventSponsorshipLevelTranslations = (
  eventId: string = "",
  levelId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSponsorshipLevelTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSponsorshipLevelTranslations>>
  >(
    EVENT_SPONSORSHIP_LEVEL_TRANSLATIONS_QUERY_KEY(eventId, levelId),
    (params: InfiniteQueryParams) =>
      GetEventSponsorshipLevelTranslations({
        ...params,
        eventId,
        levelId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!levelId && (options.enabled ?? true),
    }
  );
};
