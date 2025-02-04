import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionLocationTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_LOCATION_QUERY_KEY } from "../useGetEventSessionLocation";

/**
 * Retrieves translations for a specific event session location.
 * This function fetches the translation details for a given event session location using the event and location IDs.
 * It is useful for applications that need to display localized information for event session locations.
 * @name GetEventSessionLocationTranslations
 * @param {string} eventId - The ID of the event
 * @param {string} locationId - The ID of the location
 * @version 1.2
 **/

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_LOCATION_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  locationId: string
) => [...EVENT_SESSION_LOCATION_QUERY_KEY(eventId, locationId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_LOCATION_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_LOCATION_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionLocationTranslations>>
) => {
  client.setQueryData(
    EVENT_SESSION_LOCATION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionLocationTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  locationId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionLocationTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  locationId,
  adminApiParams,
}: GetEventSessionLocationTranslationsProps): Promise<
  ConnectedXMResponse<EventSessionLocationTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessionLocations/${locationId}/translations`,
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
export const useGetEventSessionLocationTranslations = (
  eventId: string = "",
  locationId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionLocationTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionLocationTranslations>>
  >(
    EVENT_SESSION_LOCATION_TRANSLATIONS_QUERY_KEY(eventId, locationId),
    (params: InfiniteQueryParams) =>
      GetEventSessionLocationTranslations({
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