import { ConnectedXMResponse } from "@src/interfaces";
import { EventSponsorshipTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_SPONSORSHIP_QUERY_KEY } from "../useGetEventSponsorship";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SPONSORSHIP_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  levelId: string,
  sponsorshipId: string
) => [
  ...EVENT_SPONSORSHIP_QUERY_KEY(eventId, levelId, sponsorshipId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SPONSORSHIP_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SPONSORSHIP_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSponsorshipTranslations>>
) => {
  client.setQueryData(
    EVENT_SPONSORSHIP_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSponsorshipTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  levelId: string;
  sponsorshipId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSponsorshipTranslations = async ({
  eventId,
  levelId,
  sponsorshipId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSponsorshipTranslationsProps): Promise<
  ConnectedXMResponse<EventSponsorshipTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sponsorshipLevels/${levelId}/sponsorships/${sponsorshipId}/translations`,
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
export const useGetEventSponsorshipTranslations = (
  eventId: string = "",
  levelId: string = "",
  sponsorshipId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSponsorshipTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSponsorshipTranslations>>
  >(
    EVENT_SPONSORSHIP_TRANSLATIONS_QUERY_KEY(eventId, levelId, sponsorshipId),
    (params: InfiniteQueryParams) =>
      GetEventSponsorshipTranslations({
        ...params,
        eventId,
        levelId,
        sponsorshipId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!levelId && !!sponsorshipId && (options.enabled ?? true),
    }
  );
};
