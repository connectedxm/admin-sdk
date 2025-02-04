import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventTrackTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_TRACK_QUERY_KEY } from "../useGetEventTrack";

/**
 * Retrieves translations for a specific event track.
 * This function fetches translation data for a given event track using the event and track identifiers.
 * It is useful for applications that need to display or manage translations associated with event tracks.
 * @name GetEventTrackTranslations
 * @param {string} eventId - The ID of the event
 * @param {string} trackId - The ID of the track
 * @version 1.2
**/

/**
 * @category Keys
 * @group Events
 */
export const EVENT_TRACK_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  trackId: string
) => [...EVENT_TRACK_QUERY_KEY(eventId, trackId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_TRACK_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_TRACK_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTrackTranslations>>
) => {
  client.setQueryData(
    EVENT_TRACK_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventTrackTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  trackId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventTrackTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  trackId,
  adminApiParams,
}: GetEventTrackTranslationsProps): Promise<
  ConnectedXMResponse<EventTrackTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tracks/${trackId}/translations`,
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
export const useGetEventTrackTranslations = (
  eventId: string = "",
  trackId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventTrackTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventTrackTranslations>>
  >(
    EVENT_TRACK_TRANSLATIONS_QUERY_KEY(eventId, trackId),
    (params: InfiniteQueryParams) =>
      GetEventTrackTranslations({
        ...params,
        eventId,
        trackId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!trackId && (options.enabled ?? true),
    },
    "events"
  );
};